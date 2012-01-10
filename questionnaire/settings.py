import os
import settings_local

# Django settings for questionnaire project.

DEBUG = getattr(settings_local, 'DEBUG', False)

TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('example', 'example.example@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'example_db',                      # Or path to database file if using sqlite3.
        'USER': 'sample_user',                      # Not used with sqlite3.
        'PASSWORD': 'sample',                  # Not used with sqlite3.
        'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '5432',                      # Set to empty string for default. Not used with sqlite3.
    }
}

POSTGIS_SQL_PATH = '/usr/share/postgresql/8.4/contrib'
POSTGIS_TEMPLATE = getattr(settings_local, "POSTGIS_TEMPLATE", 'template_postgis')
POSTGIS_VERSION = ('1.5.2', 1, 5, 2)


# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/Helsinki'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-US'

# SITE_ID   Questionnaire
# 7         Example

SITE_ID = getattr(settings_local, "SITE_ID", 7)

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'static'),
MEDIA_ROOT = MEDIA_ROOT[0]

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = "/static/"

CACHES = getattr(settings_local, "CACHES", {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
})

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = '#2%p1zs2%2lngirk3m(vf_o@-@l!g)ln*sb0#pqcouwvlac06f'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'geonition_utils.middleware.PreventCacheMiddleware',
)

ROOT_URLCONF = 'questionnaire.urls'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.gis',
#    'django.contrib.staticfiles',

    # softgis-api applications
    #'api.softgis_client',
    #'api.softgis_user',
    #'api.softgis_profile',
    #'api.softgis_feature',

    #geonition applications
    'geonition_utils',
    'auth',
    'opensocial_people',
    'geojson_rest',
    #'user_profile',
    'geonition_client',
    'email_rest',

    #questionnaires application
    'questions'
)
#is the mongodb in use or not, gives more possibilities for querying the json
USE_MONGODB = getattr(settings_local, "USE_MONGODB", True)

# Spatial reference system identity (srid) of the database
# 3067 EUREF_FIN_TM35FIN (ETRS89 / ETRS-TM35FIN)
SPATIAL_REFERENCE_SYSTEM_ID = 3857

STATIC_ROOT = getattr(settings_local, "STATIC_ROOT", '')
STATIC_URL = getattr(settings_local, "STATIC_URL", '/static/')
STATICFILES_DIRS = getattr(settings_local, "STATICFILES_DIRS", ('',))

#email smtp configuration
EMAIL_HOST = getattr(settings_local, 'EMAIL_HOST', 'smtp.example.com')
EMAIL_HOST_USER = getattr(settings_local, 'EMAIL_HOST_USER', 'sample')
EMAIL_FROM = getattr(settings_local, 'EMAIL_FROM', 'sample@example.com')
DEFAULT_FROM_EMAIL = getattr(settings_local, 'DEFAULT_FROM_EMAIL', 'sample@example.com')
EMAIL_CONFIRMATION_DAYS = getattr(settings_local, 'EMAIL_CONFIRMATION_DAYS', 2)
#EMAIL_BACKEND = getattr(settings_local, "EMAIL_BACKEND", 'django.core.mail.backends.smtp.EmailBackend')

# Session related configurations
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 7200

#LOGGING_CONFIG = getattr(settings_local, "LOGGING_CONFIG", 'django.utils.log.dictConfig')

#LOGGING = getattr(settings_local, "LOGGING", '{}')

#This is needed for the geonition client building
JAVASCRIPT_CLIENT_TEMPLATES = [#'softgis_profile.esri.js',
                               #'softgis_user.esri.js',
                               #'softgis_user.jquery.js',
                               'geonition_auth.jquery.js',
                               #'softgis_email.esri.js',
                               'softgis_email.jquery.js',
                               #'softgis_feature.esri.js',
                               'geonition_geojson.jquery.js',
                               'opensocial_people.jquery.js'
                               ]
