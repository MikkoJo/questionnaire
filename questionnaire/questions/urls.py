from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',

    # This is for the first page
    url(r'^$',
        'questions.views.main',
        {'file_name': 'index',
         'file_type': 'html'},
        name='main'),

    #this is for the url template tag to get html files
    url(r'^html/(?P<file_name>\w+)$',
        'questions.views.main',
        {'file_type': 'html'},
        name='main_html'),

    #this is for the url tag to get js files
    url(r'^js/(?P<file_name>\w+)$',
        'questions.views.main',
        {'file_type': 'js'},
        name='main_js'),

    #this is for the url tag to get flash files
    url(r'^swf/(?P<file_name>\w+)$',
        'questions.views.main',
        {'file_type': 'swf'},
        name='main_swf'),

    #this is for the url tag to get random content files
    url(r'^rand/(?P<file_type>\w+)/(?P<file_name>\w+)$',
        'questions.views.random_content',
        name='random_cont'),

    #this is for the url tag to get common files
    url(r'^common/(?P<file_type>\w+)/(?P<file_name>\w+)$',
        'questions.views.common',
        name='common'),

    #this is for the begin operations
    url(r'^begin$',
        'questions.views.begin',
        name='begin'),

    #this is for contact information
    url(r'^contact$',
        'questions.views.contact',
        name='contact'),

    #change language
    url(r'^setlang/$',
        'questions.views.set_language',
        name="set_language"),

    #create parent user and send an email
    url(r'^sendmail/$',
        'questions.views.send_email_to_parent',
        name="send_mail"),

    # Authenticate and login parent
    url(r'^parent/(?P<key>\w+)$',
        'questions.views.parent_login',
        name="parent_login"),

    url(r'^parent/$',
        'questions.views.parent_content',
        {'file_name': 'index',
         'file_type': 'html'},
        name='parent_start'),

    url(r'^parent/(?P<file_type>\w+)/(?P<file_name>\w+)$',
        'questions.views.parent_content',
        name='parent_content'),

    # Logout the parent
    url(r'^parent/logout/$',
        'questions.views.end_parent_questionnaire',
        name="parent_logout"),

    # Logout the children
    url(r'^logout/$',
        'questions.views.end_children_questionnaire',
        name="children_logout"),

    #(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    #(r'^admin/', include(admin.site.urls)),
)
