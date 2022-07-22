# Life Expectancy calculator Webpack 5
NacionalRe Life Expectancy calculator.

Esperanza de vida sin recargo
Esperanza de vida con recargo
Resultado final de la esperzanza de vida

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenidos</summary>
  <ol>
   <li><a href="#desarrollo">Desarrollo</a></li>
      <a href="#calculadora-de-la-esperanza-de-vida">Calculadora de la esperanza de vidad</a>
       <ul>
        <li><a href="#introducción">Introducción</a></li>
         <li><a href="#tablas">Tablas</a></li>
        <li><a href="#pasos">Pasos</a></li>
        <li><a href="#validación-del-formulario">Formulario</a></li>
         <li><a href="#variables-principales">Variables principales</a>
            <ul>
                <li><a href="#género">Género</a></li>
                <li><a href="#edad">Edad</a></li>
                <li><a href="#recargo-del-seguro-de-vida">Recargo del seguro de vida</a></li>
            </ul>
         </li>
      </ul>
    <li><a href="#esperanza-de-vida-sin-recargo">Esperanza de vida sin recargo</a></li>
    <li><a href="#esperanza-de-vida-con-recargo">Esperanza de vida con recargo</a></li>
    <li><a href="#resultado-final-de-la-esperzanza-de-vida">Resultado final de la esperzanza de vida</a></li>
    <li><a href="#traducción">Traducción</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#referencias">Referencias</a></li>
    <li><a href="#contactos">Contactos</a></li>
  </ol>
</details>


# Desarrollo
Las calculadoras han sido desarrolladas con los lenguajes HTML, CSS y Javascript con la ayuda del empaquetador de módulos [WebPack 5](https://github.com/webpack/webpack).
Webpack se define como un empaquetador de módulos (un bundler en la jerga habitual) pero que hace muchísimas cosas más:

- Gestión de dependencias
- Ejecución de tareas
- Conversión de formatos
- Servidor de desarrollo
- Carga y uso de módulos de todo tipo (AMD, CommonJS o ES2015)


> Webpack se puede considerar como un Task Runner muy especializado en el procesamiento de unos archivos de entrada para convertirlos en otros archivos de salida, para lo cual utiliza unos componentes que se denominan loaders.


## Instalación

- Entrar en la raiz de la carpeta e instalar las dependencias.

```bash
cd 20220119 VidaNr
npm install
```

- Abrir el proyecto en el navegador

```bash
npm start
```


- Construir para producción

```bash
npm run build:nacionalRe
```

# Calculadora de la esperanza de vida

## Introducción
Esta aplicación interactiva calcula la esperanza de vida de una persona una vez conocida su edad, su género y el agravante obtenido para el seguro de vida.
Calcula la esperanza de vida según el agravamiento y siguiendo las tablas de mortalidad de la población asegurada española GKMF95 y  GKMF80 (PASEM 2010) .
El mercado español en general utiliza las tablas suizas GKMF 95 para el cálculo de prima y reservas del negocio de vida que involucre riesgo de fallecimiento. 

## Tablas
- La tabla adjunta (csv) contiene el rango de edad y 4 columnas con los coeficientes correspondientes a las 2 tablas que se usan: GKx80 (ahora llamada PASEMF) y GKx95 donde x es la correspondiente al sexo (M o F).
 

- [Consultar las tablas GKMF95 Y GKMF80 (PASEM) ](docs/expectancyNR-tables_PASEM_GKF.csv).


## Pasos
Para realizar los cálculos, estos serían los pasos principales en orden de realización:

- VALIDACIÓN DEL FORMULARIO: Las campos del formularios son: edad (age), género (gender), agravamiento del seguro de vida (lnTVida).
- CALCULO DE LA ESPERANZA DE VIDA:
Finalmente, se aplican las fórmulas y tablas para cada modo de cálculo (PASEM, GKMF95).



## Validación del formulario
El primer paso sería la validación de las entradas del formulario. 
El formulario es un documento creado en HTML con unos mínimos ajustes de CSS y mucha interactividad realizada con Javascript.

![formulario expectancyNR][formulario expectancyNR]

<p align="right">(<a href="#top">Subir</a>)</p>

## Variables principales
- Todos los campos del formulario son obligatorios.
- Todos los campos tienen un mensaje de alerta ('Campo obligatorio') en el caso de que no estén rellenos.
- El botón de Calcular no se activa hasta que todos los campos sean correctos.
- El teclado tiene desactivado la tecla ENTER para que no corran los campos si se pulsa.

<p align="right">(<a href="#top">Subir</a>)</p>


### Género
Dos inputs excluyentes del tipo Radio: Hombre y mujer.
Esta varible será luego importante para calcular distintas patologías.
Es un campo obligatorio.


### Edad
Un input de tipo Date.

- La fecha no puede ser nunca mayor que el día en el que estamos.
"La fecha seleccionada no puede ser mayor que la fecha actual: Por favor, asegúrese de que la fecha es correcta".

- La edad debe estar en un rango entre 15 y 120 años (ambos incluidos).
"Atención: Fecha fuera de rango".

```bash
date >= 15 && date <=120
```

- Es un campo obligatorio: "La edad debe ser mayor de 15 y menor de 120. Tarificación cancelada".

- Para el cálculo se ha utilizado la edad actual del individuo, no la actuarial.



### Recargo del seguro de vida

- El resultado del recargo de seguro de vida obtenido en la calculadora de VidaNR.
- Por defecto, se aplica un recargo 0.
- No se contempla el cálculo de la esperanza de vida si el recargo es mayor de 300.
- La esperanza de vida representa el número medio de años que a un individuo de edad x perteneciente a la cohorte ficticia inicial le restaría por vivir. 
- Se aplica un método para tabla de vida que consiste en modificar la tabla de vida multiplicando 1 - la tasa específica de prevalencia por edad (tx), por Lx, el número de años vividos en el intervalo de edad. 



<p align="right">(<a href="#top">Subir</a>)</p>



## Esperanza de vida sin recargo

- Se busca en la tabla las columnas correspondientes la género: gkm80 y gkm95 para hombres, gkf80 y gkf95 para mujeres. 

- El recargo (variable **charge**) es 0.

```bash
// findGk finds number correspondence for age on database[gk] column
// 20 years old, gkm80 -->  0.00075
// @ age: number =  the actuarial age, 20 [20 years old]
// @ gk: any[]   = the database, the tables
// @ column: string   = the life expectancy column (gkm80) 

function findGk(age, database, column) {
    let row = database.filter(el => el["edad"] === age)[0];
    let result = row[column];
    return result;
}

```

- Función recursiva para obtener el recargo:
- Ver [Excel GK-recursive.xls](docs/expectancyNR-GK-recursive.csv).
- Ver función programa anterior en FoxPro: [expectancyNR-recursive-FoxPro.txt](expectancyNR-recursive-FoxPro.txt).
- Inspector del código en FoxPro para el primer paso de la función recursiva: 
![Función recursiva 1 FoxPro][Función recursiva 1 FoxPro]
- Inspector del código en FoxPro para el segundo paso de la función recursiva: 
![Función recursiva 2 FoxPro][Función recursiva 2 FoxPro]

```bash
// Función recursiva
// @ age: number =  la edad actual, 20 [20 años]
// @ gk: any[]   = la tabla, base de datos
// @ column: string   = la columna correspondiente de la tabla de espeeranza de vida (gkm80) 
// ver tabla de excel gk-recursive.xlsx (column G)column G
// 20 years old, gkm80 -->  996744.2261735977
// runs from 1000000 (< 15) to 19 years old gk number
// seek(20)
// (1 - 0.00073) * seek(19)
// (1 - 0.00073) * (1 - 0.00072) *  seek(18)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) * seek(17)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) *  (1 - 0.0006) * seek(16)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) *  (1 - 0.0006) * (1 - 0.00049) * seek(15)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) *  (1 - 0.0006) * (1 - 0.00049) * 1000000 = 996744.2261735977

//Javascript
function seek(age, database, column, charge) {
    if (age > 15) {
        let temp = findGk(age - 1, database, column);
        return (1 - (temp * (1 + charge))) * seek(age - 1, database, column, charge);
    } else {
        // when age is 15 recursion ends.
        return 1000000;
    }
}


```


## Esperanza de vida con recargo

- El mismo cálculo, pero se aplica el recargo (variable **charge**): se divide el recargo de vida por 100.

-   Si, por causas extrañas, la esperanza agravada es mayor que la normal (es un fallo matemático del programa) hay que rebajarla a la misma que la normal. También si devuelve un valor menor que la edad actual.

```bash
   export function seekLifeExpectancy(inputs, search) {
    // Si el recargo es mayor de 300 devuelve la edad del individuo.

    let database = "gk";
    let gender = inputs.gender === "male" ? "m" : "f";
    let table = "80";

    //let column = database + gender + table;
    let column = search.replace(':::', gender);
    let age = inputs.age.regular;
    let charge = inputs.charge / 100;
    let expectancyWithCharge;
    let expectancy;
    let k;
    let j;
    let i;

    if (+inputs.charge > 300) {
        return {
            "column": column,
            "age": age,
            "gender": gender,
            "charge": inputs.charge,
            "expectancy": age,
            "expectancyWithCharge": age
        };

    }


// el loop lo hace dos veces: una para el normal y otra para el recargo
// la primera pasada hace el recargo, la segunda sin recargo y devuelve 
// La función recursiva recorre desde 100000 (15 años) hasta justo el año anterior del seleccionada (edad -1)
// optenemos la constante K = 996744.2262 -->  CONSTANTE K, primera llamada recursiva

// for i=age to 126 --> segunda llamada recursiva
// Ahora empieza con 21 años y va hasta el final dando 0.999999...


    // Dos entradas al loop
    // el primero para el recargo (expectancyWithCharge)
    // el segundo, sin recargo (expectancyWithoutCharge (expectancy))
    // constante k
    for (j = 0; j <= 1; j++) {
        //first loop k with input charge
        k = seek(age, gk, column, charge);
        expectancy = age;

        if (k != 0) {
            for (i = age; i <= 126; i++) {
                expectancy = expectancy + (seek(i + 1, gk, column, charge) / k);
            }
        }
        // second loop runs with no charge
        if (charge > 0) {
            expectancyWithCharge = expectancy;
            charge = 0;
        }
    }

    // * Si, por causas extrañas, la esperanza agravada es mayor que la normal (es un fallo matemático del programa)
    // * hay que rebajarla a la misma que la normal.También si devuelve un valor menor que la edad actual

    if (expectancy < age) {
        expectancy = age;
    }
    if (expectancyWithCharge && expectancyWithCharge < age) {
        expectancyWithCharge = age;
    }
    if (expectancyWithCharge && expectancyWithCharge > expectancy) {
        expectancyWithCharge = expectancy;
    }



    // redondeo al más cercano
    let result = {
        "column": column,
        "age": age,
        "gender": gender,
        "charge": inputs.charge,
        "expectancy": Math.round(expectancy),
        "expectancyWithCharge": expectancyWithCharge ? Math.round(expectancyWithCharge) : Math.round(expectancy)
    };
    return result;
}


export function calculateLifeExpectancy(inputs) {
    return {
        "gk80": seekLifeExpectancy(inputs, 'gk:::80'),
        "gk95": seekLifeExpectancy(inputs, 'gk:::95'),
    }
}


```

## Resultado final de la esperzanza de vida

El resultado de la calculadora se muestra con la esperanza sin y con recargo para las dos tablas:


![result expectancyNR][result expectancyNR]




<!-- MISCELANEA -->

# Traducción

Esta calculadora no tiene traducción a un segundo idioma.


<p align="right">(<a href="#top">Subir</a>)</p>

# Licencia

Todos los derechos reservados.

Copyright 2022 Nacional de Reaseguros S.A. All Rights Reserved.


```bash
This project is Copyright (C) 2022 Nacional de Reaseguros S.A., all rights reserved.
```
<p align="right">(<a href="#top">Subir</a>)</p>


# Referencias
- Metodología para el cálculo de esperanzas de vida en salud. [Tabla de vida con múltiples decrementos](https://www.ine.es/daco/daco42/discapa/meto_evld.pdf).
- Boletín Oficial del Estado. [PASEM2010](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2012-9776).
- [Unespa, PASEM2010](https://www.unespa.es/main-files/uploads/2017/06/Tablas-mortalidad-PASEM2010.pdf)
- Ministerio de Asuntos Económicos y Transformación Digital, [Tablas biométricas sectoriales](http://www.dgsfp.mineco.es/es/Regulacion/DocumentosRegulacion/V2_Resolucio%CC%81n%20Tablas%20biome%CC%81tricas%20para%20firma%20v4%2020201216%20FINAL%20(002).pdf).


<p align="right">(<a href="#top">Subir</a>)</p>

# Contactos

- Equipo de **[Davinci](http://davinci.nacionalre.es/)** NacionalRe.
- Miguel Ángel Pinilla Lebrato: Responsable de Selección de Riesgos Nacional de Reaseguros S.A. <mpl@nacionalre.es>
- Juan Ignacio Rupérez: Reponsable de informática, NacionalRe. <jir@nacionalre.es>.
- Paloma Velasco Gómez: NacionalRe. <pvg@nacionalre.es>
- Eduardo Cruz: Project Manager, **[Visual Thinking, Comunicación y Creatividad](https://www.visualthinking.es/)**. <eduardo@visualthinking.es>.
- Juantxo Cruz: Web Development. **[juantxocruz.com](https://juantxocruz.com/)**. [@juantxocruz](https://twitter.com/juantxocruz). <jcruz16@gmail.com>

Project Link: [https://github.com/juantxocruz/webpack-expectancyNr](https://github.com/juantxocruz/webpack-expectancyNr)


<p align="right">(<a href="#top">Subir</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->


[formulario expectancyNR]: img/expectancyNR-form.png
[result expectancyNR]: img/expectancyNR-result.png
[Función recursiva 1 FoxPro]: img/expectancyNR-segunda-recursiva-1.png
[Función recursiva 2 FoxPro]: img/expectancyNR-segunda-recursiva-2.png
