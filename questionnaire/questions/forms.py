from django.forms import ModelForm
from django.forms import Textarea
from models import Feedback

class FeedbackForm(ModelForm):
    """
This form is used to validate and send
feedback email from user to administrator
"""
    
    class Meta:
        model = Feedback
        widgets= {
             'content': Textarea(attrs={'rows': '5', 'cols': '50'}),
        }


