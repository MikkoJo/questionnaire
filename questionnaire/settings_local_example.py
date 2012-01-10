# -*- coding: utf-8 -*-

ADMINS = (
    ('name', 'email'),
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}

DEBUG = True

DATABASE_ENGINE = 'django.contrib.gis.db.backends.postgis'
DATABASE_NAME = 'sample'
DATABASE_USER = 'sample'
DATABASE_PASSWORD= 'sample'

POSTGIS_SQL_PATH = "/usr/share/postgresql/8.4/contrib"
POSTGIS_TEMPLATE = "template_postgis"
POSTGIS_VERSION = ("1.5.1", 1, 5, 1)
   
#is the mongodb in use or not, gives mre possibilities fro querying the json
USE_MONGODB = True

# Spatial reference system identity (srid) of the database
# 3067 EUREF_FIN_TM35FIN (ETRS89 / ETRS-TM35FIN)
SPATIAL_REFERENCE_SYSTEM_ID = 3067

EMAIL_HOST = ''
EMAIL_HOST_USER = ''
EMAIL_FROM = ''
EMAIL_CONFIRMATION_DAYS = 2

LOGGING_CONFIG = 'django.utils.log.dictConfig'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}