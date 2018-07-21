
# Yumi
Yumi es un bot multi-propósito y ¡completamente en español!

[yumiko](./yumiko.jpg)

# Instalación
instalar  _git_ y _nodejs_ 
clonar repositorio

```sh
git clone https://github.com/EduenSarceno/Yumi.git && cd Yumi
```

instalar dependencias

```sh
npm install
```

ejecutar
- en linux :penguin:

  ```sh
  YUMI_TOKEN=<token> npm start
  ```
- en windows :checkered_flag:

  ```cmd
  SET YUMI_TOKEN=<token>
  npm start
  ```
**Nota:** ignorar las advertencias de **npm** sobre `peerDependencies`, básicamente estas advertencias indican que `discord.js` es compatible con otros módulos, y en caso de instalarse pueden desbloquear nuevas funcionalidades  o bien mejorar sustancialmente el rendimiento de la aplicación.  

# Contribución
Para contribuir en el proyecto asegúrate de haber leído antes [CONTRIBUTING.md](./CONTRIBUTING.md). 

En general, puedes contribuir de tres formas:
1. Reportando errores
2. Sugiriendo cambios
3. Haciendo _pull requests_ que arreglen los errores reportados en _1_ o 
implementando los cambios sugeridos en _2_.

Al hacer cambios en el código asegurarse de que seguir la convención publicada por [standard][standard] ; para esto, ejecutar: `npm run lint` , puedes arreglar automáticamente errores de formato (identaciones, colocación de los brazos `{` , nombre de variables, etc.) para esto, ejecutar: `npm run lint:fix`.  Si aún después de ejecutar `npm run lint:fix` el comando `npm run lint` sigue mostrando errores, estos deben resolverse manualmente ya que son errores semánticos y no errores de formato.

# Enlaces Útiles
- Documentación oficial de discord
  https://discordapp.com/developers/docs/intro 
 

[![Guía de código][standard_badge]][standard]

[standard_badge]: https://cdn.rawgit.com/standard/standard/master/badge.svg
[standard]: https://github.com/standard/standard
