from django.db import models
from django.contrib.sites.models import Site
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import send_mail

class Contact(models.Model):

    name = models.TextField()
    email = models.EmailField()
    phone = models.TextField()
    address = models.TextField()
    zipcode = models.TextField()
    city = models.TextField()
    furtherstudy = models.BooleanField(default = False)
    interview = models.BooleanField(default = False)
    moreinfo = models.BooleanField(default = False)
    givecontact = models.BooleanField(default = False)

    def __unicode__(self):
        return self.name

class Feedback(models.Model):
    """
    This model includes all the feedback
    given for the softGIS django application.
    When a feedback is saved it sends an email
    to the administrators as set in settings.py.
    >>> import settings
    >>> from softgis.models import Feedback
    >>> from django.core import mail
    >>> fb = Feedback(content='some feedback')
    >>> fb.save()
    >>> mail.outbox[0].body
    'some feedback'
    """
    content = models.TextField()
    create_time = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        app_name= Site.objects.get(id=settings.SITE_ID).name
        send_mail('Feedback for the softGIS application (' + app_name + ')',
                self.content,
                'do_not_reply@mapita.fi',
                [admin[1] for admin in settings.ADMINS],
                fail_silently=True)
            
        super(Feedback, self).save(*args, **kwargs)

    def __unicode__(self):
        return "feedback " + str(self.create_time)
        
# Model for storing authentication key for the parent in childrens questionnaire

class ParentEmail(models.Model):
    parent = models.OneToOneField(User)
    key = models.CharField(max_length=30, unique=True, null=True)
    answered = models.BooleanField(default=False)



#Models for creating softGIS questionnaires

#This is straight from how the questionnaires
#are defined, the Admin interface can be made
#more user friendly
class Section(models.Model):
    site = models.ManyToManyField(Site)
    name = models.CharField(max_length=20)

    def __unicode__(self):
        return "%s" % self.name

    #class Meta:
    #    ordering = ['index']


# questionnaire.pages choices
class Page(models.Model):
    section = models.ManyToManyField(Section)

    name = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    #content_file = models.FileField()

    #form = models.OneToOneField(Form)

    #class Meta:
    #    ordering = ['index']


#this Form is used in infotemplates and big pages
class Form(models.Model):
    pass


class InfoTemplate(models.Model):
    name = models.CharField(max_length=20,
                            unique=True)

    confirm_template = models.TextField()
    confirm_template_height = models.IntegerField()
    confirm_template_width = models.IntegerField()
    info_template = models.TextField()
    info_template_height = models.IntegerField()
    info_template_width = models.IntegerField()

    form = models.OneToOneField(Form)

# FormObject includes the attributes for for html input elements
# and ImageButton
class FormObject(models.Model):
    form = models.ForeignKey(Form)

    type = models.CharField(max_length=20)
    name = models.CharField(max_length=20)
    value = models.CharField(max_length=20)

    class Meta:
        unique_together = (('name','value'),)