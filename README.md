# Actualización
Debido a que estaré ocupado con un proyecto (al menos por un mes), tendré que
pausar el desarrollo de Yumi, no obstante toda sugerencia es bienvenida y el
proyecto aún está en desarrollo.

Nota: estaré implementando cambios incompatibles en mis tiempos libres, pero
no los subiré inmediatamente a github hasta no tener algo realmente estable.

# Yumi
Yumi es un bot multi-propósito y ¡completamente en español!

![yumiko](./yumiko.jpg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FEduenSarceno%2FYumi.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FEduenSarceno%2FYumi?ref=badge_shield)

# Instalación
se asume que el usuario tiene instalado y correctamente configurado en `PATH` los programas  _git_ y _nodejs_

1. clonar repositorio.

  ```sh
  git clone https://github.com/EduenSarceno/Yumi.git
  ```

2. instalar dependencias.

  ```sh
  cd Yumi && npm install
  ```

3. crear archivo `yumi.config.js`
  ```js
  module.exports = {
    token: '<token>',
    prefix: 'yu!'
  }
  ```
Véase el archivo de ejemplo [example-yumi.config.js](./example-yumi.config.js)

4. ejecutar

  ```sh
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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FEduenSarceno%2FYumi.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FEduenSarceno%2FYumi?ref=badge_large)