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
        'pos_neg_info_temp_html': 
            {    
        'appearancePlus':
            [('build_sparse', _(u'rakentamisen väljyys on sopiva')),
            ('beautiful_env', _(u'ympäristö on kaunis')),
            ('finnished_env', _(u'ympäristö on viimeisteltyä')),
            ('clean_env', _(u'ympäristö on siisti')),
            ('interaction_env', _(u'paikan ilmeeseen vaikuttaminen on mahdollista')),
            ('quality_price', _(u'asumisen hinta-laatusuhde on kohdallaan')),
            ('build_density', _(u'rakentamisen tiiviys on sopiva')),
            ('history', _(u'historian havina tuntuu'))
            ],
        'appearanceMinus':
            [('build_sparse', _(u'rakentaminen on liian väljää')),
            ('ugly_env', _(u'ympäristö on ruma')),
            ('unfinnished_env', _(u'ympäristön viimeistely puuttuu')),
            ('dirty_env', _(u'ympäristö on epäsiisti')),
            ('interaction_env', _(u'paikan ilmeeseen vaikuttaminen on mahdotonta')),
            ('quality_price', _(u'asumisen hinta-laatusuhde on huono')),
            ('build_density', _(u'rakentaminen on liian tiivistä')),
            ('history', _(u'historiallisuus puuttuu'))
            ],
        'socialPlus':
            [('env_care', _(u'asukkaat pitävät hyvää huolta ympäristöstä')),
            ('important_persons', _(u'minulle tärkeät ihmiset ovat lähellä')),
            ('neighbour_peace', _(u'naapurit elävät yhdessä sopuisasti')),
            ('rich_social_life', _(u'sosiaalinen elämä on vilkasta')),
            ('diversity', _(u'asukkaiden kirjo on sopiva')),
            ('image', _(u'alueen maine on hyvä')),
            ('mutual_care', _(u'asukkaat välittävät toisistaan')),
            ('social_safety', _(u'on turvallista asua ja liikkua'))
            ],
        'socialMinus':
            [('env_care', _(u'asukkaat eivät huolehdi ympäristöstä')),
            ('important_persons', _(u'minulle tärkeät ihmiset ovat kaukana')),
            ('neighbour_war', _(u'naapurit riitelevät keskenään')),
            ('no_social_life', _(u'sosiaalinen elämä on liian hiljaista')),
            ('diversity', _(u'asukkaiden kirjo on liiallinen tai liian vähäinen')),
            ('image', _(u'alueen maine on huono')),
            ('mutual_no_care', _(u'asukkaat eivät välitä toisistaan')),
            ('social_unsafe', _(u'on turvatonta asua ja liikkua'))
            ],
        'atmospherePlus':
            [('welcoming', _(u'kutsuva')),
            ('vivid', _(u'tunnelmaltaan elävä')),
            ('relaxed', _(u'rentouttava')),
            ('close_to_nature', _(u'luonnonläheinen')),
            ('quiet', _(u'meluton')),
            ('surprising', _(u'sopivan yllätyksellinen')),
            ('calm', _(u'rauhallinen')),
            ('child_friendly', _(u'lapsiystävällinen'))
            ],
        'atmosphereMinus':
            [('unwelcoming', _(u'torjuva')),
            ('dull', _(u'tunnelmaltaan kuollut')),
            ('stressful', _(u'stressaava')),
            ('absent_from_nature', _(u'kaukana luonnosta')),
            ('noisy', _(u'meluisa')),
            ('predictable', _(u'yllätyksetön')),
            ('hectic', _(u'rauhaton')),
            ('child_unfriendly', _(u'lapsikielteinen'))
            ],
        'functionalPlus':
            [('hobby_opportunities', _(u'harrastus- ja tekemismahdollisuudet ovat hyvät')),
            ('walking_or_cycling', _(u'kävellen tai pyöräillen liikkuminen on sujuvaa')),
            ('public_transport', _(u'joukkoliikenne palvelee hyvin')),
            ('driving_with_car', _(u'autolla liikkuminen on sujuvaa')),
            ('safe_traffic', _(u'liikenneturvallisuus on hyvä')),
            ('vivid_culture_life', _(u'kulttuurielämä on vilkasta')),
            ('own_lifestyle', _(u'oman elämäntavan toteuttaminen onnistuu hyvin')),
            ('service', _(u'palvelut ovat hyvät'))
            ],
        'functionalMinus':
            [('hobby_opportunities', _(u'harrastus- ja tekemismahdollisuudet ovat huonot')),
            ('walking_or_cycling', _(u'kävellen tai pyöräillen liikkuminen on hankalaa')),
            ('public_transport', _(u'joukkoliikenne palvelee huonosti')),
            ('driving_with_car', _(u'autolla liikkuminen on hankalaa')),
            ('unsafe_traffic', _(u'liikenneturvallisuus on huono')),
            ('dull_culture_life', _(u'kulttuurielämä on hiljaista')),
            ('own_lifestyle', _(u'oman elämäntavan toteuttaminen onnistuu huonosti')),
            ('service', _(u'palvelut ovat huonot'))
            ]
            },
        'improvements_gen': [
            ('imp_tourism', _(u'Matkailu')),
            ('imp_nature_preserve', _(u'Luonnonsuojelu')),
            ('imp_forestry', _(u'Metsätalous')),
            ('imp_mining', _(u'Kaivosteollisuus')),
            ]
  }