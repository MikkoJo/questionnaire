#!/usr/bin/python
# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.http import HttpResponseForbidden
from django.http import HttpResponseBadRequest
from django.http import HttpResponseRedirect
from django.contrib.sites.models import Site
from django.utils.translation import check_for_language
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.mail import BadHeaderError
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
from django.core.validators import email_re
from django.db import IntegrityError
from django.utils import translation
from django.core.urlresolvers import reverse
from django.views.decorators.vary import vary_on_headers
from django.views.decorators.cache import cache_control
from django.views.decorators.cache import never_cache

from questions.models import Contact
from questions.models import ParentEmail

import random
import hashlib
import re

#from settings import DEBUG
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout

DEBUG = settings.DEBUG

import sys
if sys.version_info >= (2, 6):
    import json
else:
    import simplejson as json

# set the ugettext _ shortcut
_ = translation.ugettext

@cache_control(public=True, max_age=3600)
def main(request, file_name='index', file_type="html"):

    site_name = Site.objects.get(id=settings.SITE_ID).name
    values = ()

    if hasattr(request, 'session'):
        try:
            #print(request.session['started'])
            started = request.session['started']
        except KeyError:
            started = "False"
    else:
        try:
            started = request.COOKIES('started')
        except KeyError:
            started = "False"

    mtype = "text/html"
    if(file_type == "js"):
        mtype = "application/javascript"

    return render_to_response("%s/%s/%s.%s" % (site_name, file_type, file_name, file_type),
                              {'site_name': site_name},
                              mimetype=mtype,
                              context_instance=RequestContext(request,
                                                              {'DEBUG': DEBUG,
                                                               'values': values
                                                                }))

#    return render_to_response(file_name + "." + file_type, {'k': 'a'},
#                              context_instance=RequestContext(request,
#                                                              {'DEBUG': DEBUG,
#                                                               'values': values
#                                                                }))

@cache_control(public=True, max_age=3600)
def begin(request, file_name='frontpage', file_type="html"):
    site_name = Site.objects.get(id=settings.SITE_ID).name

    mtype = "text/html"
    return render_to_response("%s/%s/%s.%s" % (site_name, file_type, file_name, file_type),
                              {'site_name': site_name},
                              mimetype=mtype,
                              context_instance=RequestContext(request,
                                                              {'DEBUG': DEBUG
                                                                }))

@vary_on_headers('Cookie')
@never_cache
def random_content(request, file_name, file_type='html'):


    if request.user.is_authenticated():
        random.seed(request.user.id)
    else:
        random.seed(123456)

    from values import VALUES
    if type(VALUES[file_name]) == type(list()):
        val = list(VALUES[file_name])
        random.shuffle(val)

    #if dictionary, shuffle the content of each key
    elif type(VALUES[file_name]) == type(dict()):
        val = dict.copy(VALUES[file_name])
        for key in val:
            random.shuffle(val[key])

    info_heights = VALUES.get('info_heights')

    site_name = Site.objects.get(id=settings.SITE_ID).name

    mtype = "text/html"
    if(file_type == "js"):
        mtype = "application/javascript"

    return render_to_response("%s/%s/%s.%s" % (site_name, file_type, file_name, file_type),
                              {'site_name': site_name},
                              mimetype=mtype,
                              context_instance=RequestContext(request,
                                                              {'DEBUG': DEBUG,
                                                               'values': val,
                                                               'info_heights': info_heights
                                                                }))
@cache_control(public=True, max_age=3600)
def common(request, file_name, file_type="js"):

    values = ()

    mtype = "text/html"
    if(file_type == "js"):
        mtype = "application/javascript"

    return render_to_response("%s/%s.%s" % (file_type, file_name, file_type),
                              mimetype=mtype,
                              context_instance=RequestContext(request,
                                                              {'DEBUG': DEBUG,
                                                               'values': values
                                                                }))

def contact(request):

    if not request.user.is_authenticated():
        return HttpResponseForbidden("The request has to be made by an signed in user")

    if(request.method == "GET"):
        return HttpResponseBadRequest("GET is not allowed")

    elif(request.method == "POST"):
        #mime type should be application/json
        values = None

        try:
            values = json.loads(request.POST.keys()[0])
        except ValueError, err:
            return HttpResponseBadRequest("JSON error: " + str(err.args))

        name = values.get('name')
        email = values.get('email')
        phone = values.get('phonenumber')
        sendresults = values.get('sendresults')

        contact_values = Contact(name = name,
                                 email = email,
                                 phone = phone)
        if sendresults != None:
            for val in sendresults:
                if val == 'furtherstudy':
                    contact_values.furtherstudy = True
                elif val == 'interview':
                    contact_values.interview = True
                elif val == 'moreinfo':
                    contact_values.moreinfo = True

        contact_values.save()




    return HttpResponse("")

@never_cache
def set_language(request):
    """
    This function sets the language and return
    a 200 response even if it was not succesfull.
    """
    next_page = request.REQUEST.get('next', None)
    if not next_page:
        next_page = request.META.get('HTTP_REFERER', None)
    if not next_page:
        next_page = '/'
    response = HttpResponseRedirect(next_page)
    if request.method == 'GET':
        lang_code = request.GET.get('lang', None)
        if lang_code and check_for_language(lang_code):
            if hasattr(request, 'session'):
                request.session['django_language'] = lang_code
                request.session['started'] = 'True'

            response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang_code)
            response.set_cookie('started', 'True')

    return response

def send_email_to_parent(request):
    """
    This function creates user for parent and sends an email to the user
    TODO: Check for valid email address before creating an user
    """
    if not request.user.is_authenticated():
        return HttpResponseForbidden('{"error_msg": "The request has to be made by an signed in user"}')

    if request.method != 'POST':
        return HttpResponseBadRequest('{"error_msg": "Only POST is allowed"}')

    email = request.POST.get('email', '')

    # Check validity of email address, if not valid return BadRequest
    if not email_re.match(email):
        return HttpResponseBadRequest('{"error_msg": "Not a valid email address"}')

    current_user = request.user

    create_user = request.POST.get('create_user', False)
    send_email = request.POST.get('send_email', False)

    if create_user:
        try:
            parent = User.objects.create_user(current_user.username + '_P', '', 'parent_passwd')
        except IntegrityError:
            return HttpResponse('{"error_msg": "Parent allready exists"}', status=409)
        new_parent = ParentEmail(parent = parent)
        new_parent.save()
        return HttpResponse('{"username": "' + parent.username + '"}')

    elif send_email:
        email_to = request.POST.get('email', '')
        # Check that user is created
        try:
            user_parent = User.objects.get(username=request.user.username + '_P')
        except User.DoesNotExist:
            return HttpResponseBadRequest('{"error_msg": "Target user does not exists"}')
        # Create unique key for email
        # UUID is not implemented in python 2.4
        if hasattr(request, 'session'):
            try:
                lang_code = request.session['django_language']
            except KeyError:
                lang_code = ""
        else:
            try:
                lang_code = request.COOKIES(settings.LANGUAGE_COOKIE_NAME)
            except KeyError:
                lang_code = ""

        parent = ParentEmail.objects.get(parent__exact = user_parent)
        hashkey = hashlib.sha256(lang_code + parent.parent.username).hexdigest()[:15] + str(parent.parent.id)
        parent.key = hashkey
        parent.save()
        plaintext = get_template('children/html/parent_email.txt')
        #htmly = get_template('email.html')

        d = Context({ 'key': hashkey,
                      'address': 'example.com/children/parent/'})

        subject, from_email, to = 'Kutsu osallistua lasten liikkumista käsittelevään pehmoGIS-kyselyyn', 'example@example.com', email_to
        text_content = plaintext.render(d)
        #html_content = htmly.render(d)
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        #msg.attach_alternative(html_content, "text/html")
        msg.send()

        #link = 'http://localhost:8000/questions/parent/' + hashkey
        #email_content = _(u'Create some introduction text\n') + link

#        try:
#           send_mail(_(u'Invite to the softgis questionnaire'),
#                       email_content,
#                       'pehmogis@pehmogis.fi',
#                       [email_to],
#                       fail_silently=False)
#        except BadHeaderError:
#            return HttpResponseBadRequest('{"error_msg": "Invalid header found."}')

        return HttpResponse('{"message": "Email sent successfully"}')


def parent_login(request, key=''):

    if key == '':
        HttpResponseBadRequest('{"error_msg": "No identifier supplied"}')
    try:
        pare = ParentEmail.objects.get(key__exact=key)
        if pare.answered == True:
            return HttpResponseBadRequest('{"error_msg": "You have already answered to the questionnaire"}')

        user = authenticate(username=pare.parent.username, password='parent_passwd')
        login(request, user)
        #pare.answered = True
        pare.save()

    except:
        return HttpResponse('{"error_msg": "User not found"}', status=404, content_type='application/json')
#    user = authenticate(username=pare.parent.username, password='parent_passwd')
#    login(request, user)
    site_name = Site.objects.get(id=settings.SITE_ID).name

    response = HttpResponseRedirect(reverse('parent_start'))

    if hasattr(request, 'session'):
        request.session['is_parent'] = 'True'
    else:
        response.set_cookie('is_parent', 'True')

#    return HttpResponse('{"message": "login successfully"}')
    return response

# View to serve content for the parent's questionnaire
def parent_content(request, file_name='index', file_type="html"):

    #Removed for test purposes
    if not request.user.is_authenticated():
        return HttpResponseForbidden('{"error_msg": "The request has to be made by an signed in user"}')

    if hasattr(request, 'session'):
        try:
            is_parent = request.session['is_parent']
        except KeyError:
            is_parent = "False"
    else:
        try:
            is_parent = request.COOKIES('is_parent')
        except KeyError:
            is_parent = "False"

    if is_parent != "True":
        return HttpResponseForbidden('{"error_msg": "The request has to be made by an signed in user"}')

    site_name = Site.objects.get(id=settings.SITE_ID).name
    values = ()

    mtype = "text/html"
    if(file_type == "js"):
        mtype = "application/javascript"

    return render_to_response("%s/parent/%s/%s.%s" % (site_name, file_type, file_name, file_type),
                              {'site_name': site_name},
                              mimetype=mtype,
                              context_instance=RequestContext(request,
                                                              {'DEBUG': DEBUG,
                                                               'values': values
                                                                }))
def end_parent_questionnaire(request):

    #Removed for test purposes
    if not request.user.is_authenticated():
        return HttpResponseForbidden('{"error_msg": "The request has to be made by an signed in user"}')

    if hasattr(request, 'session'):
        try:
            is_parent = request.session['is_parent']
        except KeyError:
            is_parent = "False"
    else:
        try:
            is_parent = request.COOKIES('is_parent')
        except KeyError:
            is_parent = "False"

    if is_parent != "True":
        return HttpResponseForbidden('{"error_msg": "The request has to be made by an signed in user"}')

    parent_user = ParentEmail.objects.get(parent__exact = request.user)
    parent_user.answered = True
    parent_user.save()

    logout(request)
    return render_to_response("html/thank_you.html",
                              context_instance=RequestContext(request))

def end_children_questionnaire(request):

    logout(request)
    return render_to_response("html/thank_you.html",
                              context_instance=RequestContext(request))
