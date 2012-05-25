from django.contrib import admin
from questions.models import Contact
from questions.models import FormObject
from questions.models import Section
from questions.models import Form
from questions.models import InfoTemplate
from questions.models import Page

#class SectionAdmin(admin.ModelAdmin):
    #list_display = ('name', 'index')

admin.site.register(Contact)
admin.site.register(FormObject)
admin.site.register(Form)
#admin.site.register(Section, SectionAdmin)
admin.site.register(Section)
admin.site.register(InfoTemplate)
admin.site.register(Page)

