from django.db import models
from django.contrib.sites.models import Site
from django.contrib.auth.models import User

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