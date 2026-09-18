---
title: Una breu crítica de l’ensenyament universitari d’informàtica
comments: false
categories:
  - 且未集
date: 2024-02-10 17:28:42
lang: ca
---

Assistir a classes d’informàtica és, en certa manera, deixar-se enverinar.

<!-- excerpt -->

Tinc una mica de mania perfeccionista amb la programació. Malauradament, tant a la Xina com als Estats Units, tant a l’escola com a la feina, sovint em trobo coses que em deixen bocabadat i em fan descobrir nous límits de l’increïble. Hi dono voltes i només puc concloure que hi ha una continuïtat directa de l’educació a la indústria.

Fa temps que acumulo ressentiment contra l’ensenyament d’informàtica, i he rondinat en privat a força gent sobre el fracàs i el caos de les assignatures. Avui ho ordenaré una mica. Així, en el futur només hauré de passar aquest article: potser em mantindrà la pressió arterial a ratlla i m’estalviarà molt de tecleig.

## Records

La UESTC és l’origen de la meva decepció amb l’educació informàtica. Mirant enrere, la sort dins de la desgràcia era que podies saltar-te classes, enviar-hi algú al teu lloc i dormir fora, sempre que aprovessis els finals. Per això gairebé no vaig anar a les classes de l’especialitat i vaig passar prop de dos anys fent pràctiques en altres ciutats. Aquelles classes dolentes i sense sentit eren verí per a mi.

Recordant les assignatures que vam fer els companys i jo, tot són històries per riure i plorar: sistemes operatius exigia recitar la diferència entre prevenir i evitar interbloquejos; de vuit setmanes de Java, dues eren per instal·lar l’IDE i el JDK; l’examen de dades massives era exercici físic, copiar frenèticament les diapositives impreses; a criptografia configuràvem certificats SSL en Windows Server 2003 i calculàvem RSA a mà; a l’examen d’assemblador escrivíem les instruccions de memòria. Les assignatures d’enginyeria del programari encara eren més teòriques: jo dibuixo, tu endevines, anàlisi de requisits fins que se t’adorm la mà i reportatge literari informàtic dut a la perfecció.

El més letal és que aquestes classes desconnectades de la realitat i endarrerides respecte de la indústria tenen un sentit «important»: les notes. Si vols acumular aquell no-res vaporós, per anar a l’estranger o entrar al postgrau sense examen, el coneixement escombraria et devora el temps amb un cost marginal enorme. A l’últim curs de batxillerat ja criticava que l’educació secundària era un malbaratament colossal de temps; no m’imaginava que la universitat repetiria el patró. Molts companys sortien d’hora, tornaven tard i vivien a la biblioteca, perfeccionant l’art de matar dracs dels llibres. Amb un GPA de 3,95, però, no sabien fer bé un programa senzill.

És cert que la meva perspectiva té biaix: no vull ser científic de la computació i gairebé tot el coneixement útil de les classes ja l’havia après abans. Però això encara em fa més llàstima pels altres. Potser arribaven amb somnis i confiança en la universitat i els professors, sense imaginar que només els abocarien deixalles tan lluny de la realitat com Plutó. La universitat, mentrestant, se’n vanagloria amb aquella proporció altíssima d’alumnes que continuen estudiant. Per a mi, això només indica una taxa baixa d’èxit a trobar feina.

A l’empresa vaig veure encara més els efectes d’aquella formació. Qui entra a ByteDance normalment sap escriure codi. Però notava clarament que les habilitats de la majoria dels programadors eren autolimitades: els faltava una manera eficient d’aprendre i sabien el què, però no el perquè. Revisar el codi d’alguns veterans em feia treure foc pels ulls: des de la implementació fins a l’arquitectura, semblava que al cervell els faltessin connexions. D’altres no tenien capacitats bàsiques de comprensió i comunicació: una cosa senzilla s’havia d’explicar de tres maneres diferents. Els nouvinguts sovint eren els més aterridors. Molts no sabien aprendre sols, deixaven Google abandonat i et perseguien amb preguntes generals elementals. Només faltava explicar-los el codi línia per línia.

Segons he observat, és un problema general, amb poca relació amb el currículum acadèmic. A ByteDance, els que més maldecaps em donaven o eren doctors o venien d’universitats prestigioses. Et fa preguntar què dimonis li passa a l’educació informàtica del món. Després de més de tres anys de tortura, vaig perdre tota fe en el prestigi i els títols: com més brillant és el bagatge acadèmic, més sospito de la capacitat de l’altre.

Més tard vaig arribar als Estats Units. UCR no és de primera línia, i molts xinesos la veuen com una universitat americana de segona categoria, però serveix per entreveure el sistema UC i l’ensenyament americà. Francament, em va decebre, tot i que no hi havia dipositat cap esperança. Les classes tenen menys memorització a la xinesa, però continuen sent poc destacables. Moltes assignatures de màster amb «advanced» al nom només apleguen retalls del camp en una introducció. Em costa imaginar que aprendre allò et faci mereixedor del títol de «master».

Des d’aleshores tinc encara més clara la convicció: no confiïs en la formació reglada; no esperis aprendre res a classe.

## Un mal arrelat

Alguna cosa no va bé en l’ensenyament informàtic del món. Un llibre que m’ha ajudat molt, **The Clean Coder: A Code of Conduct for Professional Programmers**, dedica un capítol a criticar la formació reglada i explicar com s’hauria de tutoritzar realment en aquest camp. El recomano vivament a qualsevol programador.

> La qualitat dels graduats en informàtica sempre m’ha decebut força. El motiu no és que no siguin intel·ligents o no tinguin talent, sinó que les universitats no ensenyen a programar de debò.
>
> ...No tots els graduats resulten decebedors; també n’hi ha de molt bons. Però he observat un tret comú entre els que estan a l’altura: gairebé tots havien **après a programar pel seu compte** abans d’entrar a la universitat, i hi havien mantingut l’hàbit d’autoaprenentatge.
>
> No em malinterpreteu. Crec que a la universitat es pot rebre una bona educació, però també crec que s’hi pot passar de puntetes, obtenir un diploma i no saber res.
>
> —*The Clean Coder*

L’autor no detalla gaire les mancances de la formació reglada. M’atreviré a fer d’aprenent davant del mestre i n’apuntaré algunes segons la meva experiència.

Primer, la manca de formació general. Totes les universitats tenen assignatures obligatòries amb aquest nom, però qui dissenya els plans n’interpreta malament el fons. La formació general en informàtica no és C, estructures de dades i algorismes: és lògica formal, cerca d’informació i les idees que donen coherència a la varietat de coses del camp. Necessitem pensar lògicament per entendre causes i anar al moll dels problemes, i Google i Stack Overflow per trobar materials que ja superen la capacitat del cervell. Unes quantes idees centrals, un cop enteses, obren moltes portes: quants sistemes i dissenys no es fonamenten en «alta cohesió i baix acoblament»? Però la universitat s’obstina a repartir una mica de cada disciplina bàsica i teoria, empassar-se continguts per a l’examen i memoritzar. Acaba reproduint la mentalitat de la selectivitat xinesa: recitar en lloc d’entendre, obeir en lloc de qüestionar, obrir la boca perquè t’alimentin en lloc d’explorar.

Segon, l’envelliment del coneixement professional. Si almenys ensenyessin bé la tècnica, les universitats podrien competir amb els cursos de formació i produir regularment peces útils per a la societat. Però el coneixement dels docents va, en gairebé tots els àmbits, una o dues dècades endarrerit. La informàtica és una disciplina jove que evoluciona de pressa: en menys d’un segle ha viscut diverses revolucions. Els professors fa temps que han perdut el contacte amb la indústria i ben pocs volen seguir el ritme. Encara que coneguin coses noves, difícilment les podran portar a classe, perquè cal tenir en compte com s’ho prendran els professors veterans. Els coneixements antiquats no serveixen a la indústria, però els alumnes tampoc no han après com aprendre. Per això confien a fer-ho al postgrau. I el postgrau repeteix mecànicament el grau: tres anys de cost d’oportunitat per absorbir més brossa. En alguns aspectes, un grau d’informàtica rendeix menys que un cicle de dos anys i mig o un curs de reconversió a programador.

Tercer, amb una mica de prejudici personal: falta educació més enllà de la tècnica, especialment en expressió i sentit estètic. Veig molts programadors amb mancances lingüístiques i un gust preocupant. La capacitat d’expressar-se no determina només si parles amb ordre: reflecteix el pensament lògic. Si en documentar programari no saps donar context ni pensar si el lector t’entendrà, probablement tampoc no sabràs triar la lògica adequada a cada cas quan programis. I si no distingeixes la bellesa de la lletjor, pots dissenyar arquitectures i estructures de dades de manera barroera i causar danys sense fi. La universitat sembla no entendre-ho. A la meva UESTC, una institució purament cientificotècnica, els estudiants d’humanitats havien de fer matemàtiques i física; els tècnics només teníem una assignatura de «Clàssics de la civilització humana» que es podia aprovar sense esforç. Em recorda el menyspreu habitual dels tècnics envers les lletres, encara que ells mateixos amb prou feines sàpiguen parlar amb fluïdesa.

Encara agraeixo haver pres, per una sèrie de coincidències, les decisions correctes. Davant de tants estudiants, però, només em queda sospirar.

## Un nus sense sortida

Quina és la solució? Malauradament, no ho sé. La universitat moderna funciona bé per a moltes disciplines tradicionals, però fracassa una vegada i una altra davant d’un camp tan nou i canviant. *The Clean Coder* proposa una tutoria interna a les empreses, eficaç i poc convencional, perquè no es pot confiar a les universitats la formació de desenvolupadors madurs. Em costa no estar-hi d’acord.

Però no oferir cap suggeriment seria massa pessimista. Per a mi, el més urgent és introduir una formació general de debò: una assignatura de lògica formal i una de cerca d’informació, totes dues arrelades a la vida real. He llegit un manual xinès de *Lògica formal* i encara és massa teòric. Caldrien exemples reals, com les fal·làcies de les baralles d’internet. La cerca d’informació hauria d’ensenyar, en realitat, *Com fer preguntes de manera intel·ligent*: tothom sap obrir un cercador, però no necessàriament triar les paraules clau correctes. Són coneixements útils per a gairebé qualsevol disciplina i persona, no només per a informàtica. Ara bé, amb les circumstàncies particulars de la Xina, potser ni aquests suggeriments són viables.

En conjunt, considero que l’ensenyament universitari d’informàtica és un nus sense sortida. Potser exigeix renovar de dalt a baix el sistema universitari. Si no, només podem confiar que l’interès, les decisions i la sort individuals duguin cadascú pel bon camí, o que els professionals veterans hi dediquin una energia enorme per tornar-los a formar.

Finalment, l’aclariment de costum: el que conec és limitat, no cobreix totes les universitats del món i no he tractat la formació investigadora. Però crec que el que descric és l’estat habitual de les assignatures d’informàtica. Estimo la informàtica. No m’agrada aquest estat habitual.
