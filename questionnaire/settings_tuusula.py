from settings import *

# Site id of the example application

SITE_ID = 10

LANGUAGE_CODE = 'fi-fi'

LANGUAGES = (('fi', 'finnish'),)

#MEDIA_ROOT = '/home/mikko/.virtualenvs/geon_new/lib/python2.7/site-packages/gntimages-0.1-py2.7.egg/gntimages'
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', #gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'tuusula',                      # Or path to database file if using sqlite3.
        'USER':  getattr(settings_local, 'DATABASE_USER', ''), # Not used with sqlite3.
        'PASSWORD': getattr(settings_local, 'DATABASE_PW', ''), # Not used with sqlite3.
        'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': getattr(settings_local, 'DATABASE_PORT', '5432'),                      # Set to empty string for default. Not used with sqlite3.
    }
}

MONGODB_DBNAME = "tuusula"

USE_MONGODB = False
