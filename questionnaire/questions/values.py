#!/usr/bin/python
# -*- coding: utf-8 -*-
#from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as _


VALUES = {
        'thingsappreciate': [
                 ('quiet', _(u'Arvostan asuinalueen rauhallisuutta.'),
                  _(u'Arvostan elämää ja toimintaa asuinalueella.')),
                 ('longdist', _(u'Voin hakea tarvitsemiani arkisia palveluja vaikka kauempaa.'),
                  _(u'Arvostan asuinalueen lähipalveluja ja suosin niitä.')),
                 ('nature', _(u'Haluan hyvät yhteydet laajoille luonto- ja virkistysalueille.'),
                  _(u'Lähipuisto riittää luonnoksi minulle.')),
                 ('car_bike', _(u'Arvostan sujuvia yhteyksiä autolla.'),
                  _(u'Arvostan liikkumista julkisilla, kävellen tai pyörällä.')),
                 ('ecology', _(u'Haluan asua ja elää mahdollisimman ekologisesti.'),
                  _(u'Muut kuin ekologiset asiat ovat minulle tärkeitä asumisessa.')),
                 ('stay', _(u'Haluan asettua alueelle jäädäkseni.'),
                  _(u'Muuttaminen tuo virkistävää vaihtelua elämään.')),
                 ('residence', _(u'Pyrin satsaamaan asumiseen mahdollisimman paljon.'),
                  _(u'Minulle monet muut asiat elämässä ovat asumista tärkeämpiä ja haluan satsata niihin.')),
                 ('diy', _(u'Olen ”tee se itse” –tyyppi.'),
                  _(u'Olen ”avaimet käteen” -tyyppi.')),
                 ('homefree', _(u'Arvostan vapaa-ajan viettoa kotona.'),
                  _(u'Arvostan vapaa-ajanviettoa kodin ulkopuolella.')),
                 ('social', _(u'Arkinen apu ja seurustelu naapureiden kanssa ovat minulle tärkeitä.'),
                  _(u'Hyvän päivän tuttuus naapureiden kanssa riittää minulle.'))
                 ],
        'environmentsummary':
            [(_(u'Ympäristön tunnelma'),
                    'atmosphereSum'),
             (_(u'Ympäristön toimintamahdollisuudet'),
                    'functionalSum'),
             (_(u'Sosiaalinen ilmapiiri'),
                    'socialSum'),
             (_(u'Ympäristön ulkoinen ilme'),
                    'appearanceSum')
             ],
        'weights':
            [(_(u'Ympäristön tunnelma'),
                    'atmosphereSum'),
             (_(u'Ympäristön toimintamahdollisuudet'),
                    'functionalSum'),
             (_(u'Sosiaalinen ilmapiiri'),
                    'socialSum'),
             (_(u'Ympäristön ulkoinen ilme'),
                    'appearanceSum')
             ],
  }