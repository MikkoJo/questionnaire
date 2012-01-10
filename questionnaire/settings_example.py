from settings import *

# Site id of the example application

SITE_ID = 7

LANGUAGE_CODE = 'fi-FI'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', #gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'example_db',                      # Or path to database file if using sqlite3.
        'USER': 'sample_user',                      # Not used with sqlite3.
        'PASSWORD': 'sample_user',                  # Not used with sqlite3.
        'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '5432',                      # Set to empty string for default. Not used with sqlite3.
    }
}

MONGODB_DBNAME = "example"
