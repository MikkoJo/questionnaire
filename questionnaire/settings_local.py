import logging
import os

path = os.path.dirname(__file__)
SITE_ID = 7
STATIC_ROOT = os.path.join(os.path.dirname(__file__), "questions/static")

DEBUG = True
USE_MONGODB = False

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

