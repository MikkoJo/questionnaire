from settings import *

# Site id of the example application

SITE_ID = 8

LANGUAGE_CODE = 'fi-fi'

LANGUAGES = (('fi', 'finnish'),)

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', #gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'hyvinkaa',                      # Or path to database file if using sqlite3.
        'USER': 'pehmogis',                      # Not used with sqlite3.
        'PASSWORD': 'pehmogis',                  # Not used with sqlite3.
        'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '5433',                      # Set to empty string for default. Not used with sqlite3.
    }
}

MONGODB_DBNAME = "hyvinkaa"
