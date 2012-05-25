from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.defaults import *
from django.contrib import admin


#admin
admin.autodiscover()

urlpatterns = patterns('',
    #softgis-api urls
    #(r'^client/', include('api.softgis_client.urls')),
    #(r'^user/', include('api.softgis_user.urls')),
    #(r'^profile/', include('api.softgis_profile.urls')),
    #(r'^feature/', include('api.softgis_feature.urls')),

    #questionnaire urls
    (r'^questions/', include('questions.urls')),

    #geonition urls
    (r'^gclient/', include('geonition_client.urls')),
    (r'^guser/', include('auth.urls')),
    #(r'^gprofile/', include('user_profile.urls')),
    (r'^gfeature/', include('geojson_rest.urls')),
    (r'^gemail/', include('email_rest.urls')),
    (r'^gopen_people/', include('opensocial_people.urls')),
    (r'^data_processing/', include('data_processing.urls')),
    (r'^geonition_maps/', include('maps.urls')),

    #admin
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
)


urlpatterns += staticfiles_urlpatterns()
