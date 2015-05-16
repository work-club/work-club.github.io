### Spriting

Spritesheets are generated using Gulp and the [css-sprite](https://www.npmjs.com/package/css-sprite) module. Only retina assets are needed to make both the standard and retina spritesheets. All retina assets need to go within `app/images/sprite/src-2x`.

To generate run the following task: `gulp sprites`. Sprites can then be used by either:

```css
.example1 {
	@include sprite($FILE_NAME_OF_PNG);
}
```

and then included like this `<i class="sprite  example1"...`

or extending the .sprite class:

```css
.example2 {
	@extend .sprite;
	@include sprite($FILE_NAME_OF_PNG);
}
```

and then included like this `<i class="example2"...`

See [css-sprite](https://www.npmjs.com/package/css-sprite) for more information on options and usage.

__Couple of things to note:__

* css-sprite uses [lwip](https://github.com/EyalAr/lwip) for image processing. The quality of the non-retina image isn't great and there is currently [an open issue](https://github.com/EyalAr/lwip/issues/109) regarding this which we should keep an eye on.
* Currently you need to run `gulp sprite` to generate a new spritesheet. We could automate this if needed by adding a watch on the src folder, it could also run as part of the default `gulp` task if needed.


### Responsive images

Responsive images are totally optional. We have opted to implement the ```<picture>``` tag version of the syntax, for the following reasons:

* Degrades well
* It is very close to the finished spec
* When using the polyfill script, it will work with IE9 (with a small hack)
* Whilst more verbose, it is much more readable
* Visually very close to ```<video></video>``` and therefore more intuitive for developers new to the project.

The simplest syntax is as follows:

```<picture>
	<!--[if IE 9]><video style="display: none;"><![endif]-->
		<source srcset="/images/480x450.gif" media="(max-width: 480px)">
		<source srcset="/images/640x450.gif" media="(max-width: 640px)">
	<!--[if IE 9]></video><![endif]-->
	<img srcset="/images/1024x450.gif" alt="">
</picture>
```
The fallback should always been the final image tag and should never be omitted.

For more information, please [read the Responsive Images Community Groups information on the issue](http://scottjehl.github.io/picturefill/)
