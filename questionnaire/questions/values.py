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
                 ('car_bike', _(u'Arvostan sujuvia yhteyksiä autolla.'),
                  _(u'Arvostan liikkumista julkisilla, kävellen tai pyörällä.')),
                 ('diy', _(u'Olen ”tee se itse” –tyyppi.'),
                  _(u'Olen ”avaimet käteen” -tyyppi.')),
                 ('homefree', _(u'Arvostan vapaa-ajan viettoa kotona.'),
                  _(u'Arvostan vapaa-ajanviettoa kodin ulkopuolella.')),
                 ('social', _(u'Arkinen apu ja seurustelu naapureiden kanssa ovat minulle tärkeitä.'),
                  _(u'Hyvän päivän tuttuus naapureiden kanssa riittää minulle.')),
                 ('nature', _(u'Haluan hyvät yhteydet laajoille luonto- ja virkistysalueille.'),
                  _(u'Lähipuisto riittää luonnoksi minulle.')),
                 ('ecology', _(u'Haluan asua ja elää mahdollisimman ekologisesti.'),
                  _(u'Muut kuin ekologiset asiat ovat minulle tärkeitä asumisessa.')),
                 ('stay', _(u'Haluan asettua alueelle jäädäkseni.'),
                  _(u'Muuttaminen tuo virkistävää vaihtelua elämään.')),
                 ('residence', _(u'Pyrin satsaamaan asumiseen mahdollisimman paljon.'),
                  _(u'Minulle monet muut asiat elämässä ovat asumista tärkeämpiä ja haluan satsata niihin.')),
                 ],
        'profile': [
                 ('quiet', _(u'Arvostan asuinalueen rauhallisuutta.'),
                  _(u'Arvostan elämää ja toimintaa asuinalueella.')),
                 ('longdist', _(u'Voin hakea tarvitsemiani arkisia palveluja vaikka kauempaa.'),
                  _(u'Arvostan asuinalueen lähipalveluja ja suosin niitä.')),
                 ('car_bike', _(u'Arvostan sujuvia yhteyksiä autolla.'),
                  _(u'Arvostan liikkumista julkisilla, kävellen tai pyörällä.')),
                 ('diy', _(u'Olen ”tee se itse” –tyyppi.'),
                  _(u'Olen ”avaimet käteen” -tyyppi.')),
                 ('homefree', _(u'Arvostan vapaa-ajan viettoa kotona.'),
                  _(u'Arvostan vapaa-ajan viettoa kodin ulkopuolella.')),
                 ('social', _(u'Arkinen apu ja seurustelu naapureiden kanssa ovat minulle tärkeitä.'),
                  _(u'Hyvän päivän tuttuus naapureiden kanssa riittää minulle.')),
                 ('forest_park', _(u'Metsät ja luonnontilaiset virkistysalueet ovat parhaita virkistymiseen.'),
                  _(u'Hoidetut puistot ja laadukkaat istutukset ovat minulle tärkeitä.')),
                 ('active', _(u'Olen aktiivinen liikkuja.'),
                  _(u'En ole liikunnallinen.')),
                 ('homework', _(u'Arvostan mahdollisuutta tehdä töitä kotona.'),
                  _(u'Etätyö ei sovi minulle.')),
                 ('woodenhouse', _(u'Puurakentamisen tarjoamat mahdollisuudet kiinnostavat minua.'),
                  _(u'Asunnon rakennusmateriaaleilla ei ole minulle niin väliä.')),
                 ('history', _(u'Alueen historia ja tausta kiehtoo minua.'),
                  _(u'Alueen historia ei ole itselleni merkityksellinen asia.')),
                 ('local_food', _(u'Olen kiinnostunut lähiruoasta ja mahdollisuudesta viljelypalstaan.'),
                  _(u'Ruuan lähituotanto ei ole itselleni tärkeää.')),
                 ('wind_energy', _(u'Pidän tuuli-, aurinko- ja/tai maa-/kalliolämmön lähituotantoa tärkeänä.'),
                  _(u'En ole erityisen kiinnostunut energiantuottomuodoista.')),
                 ('parking', _(u'Arvostan pysäköintiä asunnon välittömässä läheisyydessä.'),
                  _(u'Arvostan autotonta piha-aluetta.')),
                 ('lifestyle', _(u'Haluan asua samassa elämäntilanteessa tai samaa elämäntapaa edustavien kanssa.'),
                  _(u'Arvostan monipuolista asukasrakennetta.')),
                 ],
        'environment':
            [(_(u'Ympäristön tunnelma'),
                    'atmospherePlus',
                    'atmosphereMinus'),
             (_(u'Ympäristön toimintamahdollisuudet'),
                    'functionalPlus',
                    'functionalMinus'),
             (_(u'Sosiaalinen ilmapiiri'),
                    'socialPlus',
                    'socialMinus'),
             (_(u'Ympäristön ulkoinen ilme'),
                    'appearancePlus',
                    'appearanceMinus')
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
        'extra_info_temp_html':
            {
        'like_info':
            [('beat_landscape', _(u'kaunis maisema')),
            ('safe', _(u'turvallisuus (ei eksymisen tai petojen uhkaa)')),
            ('passable_env', _(u'helppokulkuinen ympäristö')),
            ('peaceful', _(u'rauhallinen ja hiljainen ympäristö')),
            ('easy_access', _(u'helposti saavutettava')),
            ('economy_profit', _(u'taloudellinen hyöty tai muu konkreettinen hyöty (mm. luonnontuotteet)')),
            ('versatile', _(u'monipuolinen ja kiinnostava kasvi- ja eläinlajisto ')),
            ('culture_history', _(u'kulttuurihistoria')),
            ('training', _(u'kuntoilumahdollisuudet'))
            ],
        'dislike_info':
            [('unpleasant_landscape', _(u'epämiellyttävä maisema')),
            ('scary', _(u'pelottava ja/tai vaikeakulkuinen ympäristö')),
            ('noisy_env', _(u'rauhaton ja meluisa ympäristö')),
            ('difficult_access', _(u'vaikeasti saavutettava')),
            ('economy_harm', _(u'taloudellinen tai muu konkreettinen haitta')),
            ('unpleasant_memories', _(u'epämiellyttävät muistot ja kokemukset')),
            ('spoiled_natural_state', _(u'luonnontila pilattu, miten?'))
            ]},
        'improvements_gen': [
            ('imp_tourism', _(u'Matkailu')),
            ('imp_nature_preserve', _(u'Luonnonsuojelu')),
            ('imp_forestry', _(u'Metsätalous')),
            ('imp_mining', _(u'Kaivosteollisuus')),
            ]
  }