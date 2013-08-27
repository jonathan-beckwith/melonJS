/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 */

(function($) {
	
	/**
	 * A base class for renderable objects.
	 * @class
	 * @extends me.Rect
	 * @memberOf me
	 * @constructor
	 * @param {me.Vector2d} pos position of the renderable object
	 * @param {int} width object width
	 * @param {int} height object height
	 */
	me.Renderable = me.Rect.extend(
	/** @scope me.Renderable.prototype */
	{
		/**
		 * to identify the object as a renderable object
		 * @ignore
		 */
		isRenderable : true,
		
		/**
		 * the visible state of the renderable object<br>
		 * default value : true
		 * @public
		 * @type Boolean
		 * @name visible
		 * @memberOf me.Renderable
		 */
		visible : true,

		/**
		 * Whether the renderable object is visible and within the viewport<br>
		 * default value : false
		 * @public
		 * @readonly
		 * @type Boolean
		 * @name inViewport
		 * @memberOf me.Renderable
		 */
		inViewport : false,

		/**
		 * Whether the renderable object will always update, even when outside of the viewport<br>
		 * default value : false
		 * @public
		 * @type Boolean
		 * @name alwaysUpdate
		 * @memberOf me.Renderable
		 */
		alwaysUpdate : false,

		/**
		 * Whether to update this object when the game is paused.
		 * default value : false
		 * @public
		 * @type Boolean
		 * @name updateWhenPaused
		 * @memberOf me.Renderable
		 */
		updateWhenPaused: false,

		/**
		 * make the renderable object persistent over level changes<br>
		 * default value : false
		 * @public
		 * @type Boolean
		 * @name isPersistent
		 * @memberOf me.Renderable
		 */
		isPersistent : false,
		
		/**
		 * Define if a renderable follows screen coordinates (floating)<br>
		 * or the world coordinates (not floating)<br>
		 * default value : false
		 * @public
		 * @type Boolean
		 * @name floating
		 * @memberOf me.Renderable
		 */
		floating : false,

		/**
		 * Z-order for object sorting<br>
		 * default value : 0
		 * @private
		 * @type Number
		 * @name z
		 * @memberOf me.Renderable
		 */
		z : 0,
		
		/**
		 * Set the angle (in Radians) of a renderable to rotate it <br>
		 * WARNING: rotating sprites decreases performances
		 * @public
		 * @type Number
		 * @name me.SpriteObject#angle
		 */
		angle: 0,
		
		/**
		 * the renderable transformation matrix <br>
		 * @public
		 * @type me.Matrix2d
		 * @name matrix
		 * @memberOf me.Renderable
		 */
		matrix : null,
		
		/*
		 * current scale factor of the renderable
		 * @ignore
		 */
		_scale : null,
		

		/**
		 * @ignore
		 */
		init : function(pos, width, height) {
			// call the parent constructor
			this.parent(pos, width, height);
			
			// reset default scale and angle
			if (this._scale === null) {
				this._scale = new me.Vector2d(1.0, 1.0);
			} else {
				this._scale.set(1.0, 1.0);
			}
			this.angle = 0;
			
			// set a default transformation matrix
			if (this.matrix === null) {
				this.matrix = new me.Matrix2d();
			} else {
				this.matrix.identity();
			}

		},
		
		/**
		 * update the transformation matrix with the specified values.<br>
		 * (the current matrix will be multiplied using the specified values)
		 * @name transform
		 * @memberOf me.Renderable
		 * @function
		 * @public
		 * @param {Number} a the m1,1 (m11) value in the matrix
		 * @param {Number} b the m1,2 (m12) value in the matrix
		 * @param {Number} c the m2,1 (m21) value in the matrix
		 * @param {Number} d the m2,2 (m22) value in the matrix
		 * @param {Number} e The delta x (dx) value in the matrix
		 * @param {Number} f The delta x (dy) value in the matrix
		 **/
		transform : function(a ,b, c, d, e, f) {
			this.matrix.multiply(a ,b, c, d, e, f);
		},
		
		/**
		 * set the renderable transformation matrix to new values.<br>
		 * (setTransform will reset the matrix to the identity one before applying the new value)
		 * @name setTransform
		 * @memberOf me.Renderable
		 * @function
		 * @public
		 * @param {Number} a the m1,1 (m11) value in the matrix
		 * @param {Number} b the m1,2 (m12) value in the matrix
		 * @param {Number} c the m2,1 (m21) value in the matrix
		 * @param {Number} d the m2,2 (m22) value in the matrix
		 * @param {Number} e The delta x (dx) value in the matrix
		 * @param {Number} f The delta x (dy) value in the matrix
		 **/
		setTransform : function(a ,b, c, d, e, f) {
			this.matrix.set(a ,b, c, d, e, f);
		},
		
		/**
		 * rotate the renderable around its anchor point
		 * @name rotate
		 * @memberOf me.Renderable
		 * @function
		 * @public
		 * @param {Number} angle the rotation angle in radians
		 **/
		rotate : function(angle) {
			if (angle !== this.angle) {
				this.angle = angle - this.angle;
				this.matrix.rotate(this.angle);
			}
		},
		
		/**
		 * scale the renderable around his anchor point<br>
		 * @name scale
		 * @memberOf me.Renderable
		 * @function
		 * @param {Number} scaleX x scaling ratio
		 * @param {Number} [scaleY=scaleX] y scaling ratio
		 */
		scale : function(scaleX, scaleY) {
	
			// set to scaleX if not defined
			scaleY = (scaleY === undefined) ? scaleX : scaleY;
			
			if (this._scale.x !== scaleX) {
				scaleX = this._scale.x = (1/this._scale.x) * scaleX;
			} else {
				scaleX = 1;
			}
			
			if (this._scale.y !== scaleY) {
				scaleY = this._scale.y = (1/this._scale.y) * scaleY;
			} else {
				scaleY = 1;
			}
			
			// apply the scaling factor
			this.matrix.scale(
				scaleX, 
				scaleY
			);
		},
		

		/**
		 * update function
		 * called by the game manager on each game loop
		 * @name update
		 * @memberOf me.Renderable
		 * @function
		 * @protected
		 * @return false
		 **/
		update : function() {
			return false;
		},

		/**
		 * object draw
		 * called by the game manager on each game loop
		 * @name draw
		 * @memberOf me.Renderable
		 * @function
		 * @protected
		 * @param {Context2d} context 2d Context on which draw our object
		 **/
		draw : function(context, color) {
			// draw the parent rectangle
			this.parent(context, color);
		}
	});
	

	/*---------------------------------------------------------*/
	// END END END
	/*---------------------------------------------------------*/
})(window);
