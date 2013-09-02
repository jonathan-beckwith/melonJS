/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 */

(function($) {
	
	/************************************************************************************/
	/*                                                                                  */
	/*      a rectangle Class Object                                                    */
	/*                                                                                  */
	/************************************************************************************/
	/**
	 * a rectangle Object
	 * @class
	 * @extends Object
	 * @memberOf me
	 * @constructor
	 * @param {me.Vector2d} v x,y position of the rectange
	 * @param {int} w width of the rectangle
	 * @param {int} h height of the rectangle
	 */
	me.Rect = Object.extend(
	/** @scope me.Rect.prototype */	{
	
		/**
		 * position of the Rectange
		 * @public
		 * @type me.Vector2d
		 * @name pos
		 * @memberOf me.Rect
		 */
		pos : null,

		/**
		 * allow to reduce the collision box size<p>
		 * while keeping the original position vector (pos)<p>
		 * corresponding to the entity<p>
		 * colPos is a relative offset to pos
		 * @ignore
		 * @type me.Vector2d
		 * @name colPos
		 * @memberOf me.Rect
		 * @see me.Rect#adjustSize
		 */
		colPos : null,
		
		/**
		 * Define the object anchoring point<br>
		 * This is used when positioning, or scaling the object<br>
		 * The anchor point is a value between 0.0 and 1.0 (1.0 being the maximum size of the object) <br>
		 * (0, 0) means the top-left corner, <br> 
		 * (1, 1) means the bottom-right corner, <br>
		 * default anchoring point is the center (0.5, 0.5) of the object.
		 * @public
		 * @type me.Vector2d
		 * @name anchorPoint
		 * @memberOf me.Rect
		 */
		anchorPoint: null,
				
		/**
		 * left coordinate of the Rectange<br>
		 * takes in account the adjusted size of the rectangle (if set)
		 * @public
		 * @type Int
		 * @name left
		 * @memberOf me.Rect
		 */
		 // define later in the constructor
		
		/**
		 * right coordinate of the Rectange<br>
		 * takes in account the adjusted size of the rectangle (if set)
		 * @public
		 * @type Int
		 * @name right
		 * @memberOf me.Rect
		 */
		 // define later in the constructor
		 
		/**
		 * bottom coordinate of the Rectange<br>
		 * takes in account the adjusted size of the rectangle (if set)
		 * @public
		 * @type Int
		 * @name bottom
		 * @memberOf me.Rect
		 */
		// define later in the constructor
		
		/**
		 * top coordinate of the Rectange<br>
		 * takes in account the adjusted size of the rectangle (if set)
		 * @public
		 * @type Int
		 * @name top
		 * @memberOf me.Rect
		 */
		// define later in the constructor
		 
		/**
		 * width of the Rectange
		 * @public
		 * @type Int
		 * @name width
		 * @memberOf me.Rect
		 */
		width : 0,
		/**
		 * height of the Rectange
		 * @public
		 * @type Int
		 * @name height
		 * @memberOf me.Rect
		 */
		height : 0,

		// half width/height
		hWidth : 0,
		hHeight : 0,
		
		
		/** @ignore */
		init : function(v, w, h) {
			// reference to the initial position
			// we don't copy it, so we can use it later
			this.pos = v;

			// allow to reduce the hitbox size
			// while on keeping the original pos vector
			// corresponding to the entity
			this.colPos = new me.Vector2d();

			this.width = w;
			this.height = h;

			// half width/height
			this.hWidth = ~~(w / 2);
			this.hHeight = ~~(h / 2);
			
			// set the default anchor point (middle of the sprite)
			this.anchorPoint = new me.Vector2d(0.5, 0.5);

			// redefine some properties to ease our life when getting the rectangle coordinates
			Object.defineProperty(this, "left", {
				get : function() {
					return this.pos.x;
				},
				configurable : true
			});
			
			Object.defineProperty(this, "right", {
				get : function() {
					return this.pos.x + this.width;
				},
				configurable : true
			});

			Object.defineProperty(this, "top", {
				get : function() {
					return this.pos.y;
				},
				configurable : true
			});

			Object.defineProperty(this, "bottom", {
				get : function() {
					return this.pos.y + this.height;
				},
				configurable : true
			});

		},

		/**
		 * set new value to the rectangle
		 * @name set
		 * @memberOf me.Rect
		 * @function
		 * @param {me.Vector2d} v x,y position for the rectangle
		 * @param {int} w width of the rectangle
		 * @param {int} h height of the rectangle	 
		 */
		set : function(v, w, h) {
			this.pos = v; // Vector2d - top left corner

			this.width = w;
			this.height = h;
			
			this.hWidth = ~~(w / 2);
			this.hHeight = ~~(h / 2);
		},

		/**
		 * return a new Rect with this rectangle coordinates
		 * @name getRect
		 * @memberOf me.Rect
		 * @function
		 * @return {me.Rect} new rectangle	
		 */
		getRect : function() {
			return new me.Rect(this.pos.clone(), this.width, this.height);
		},
		
		/**
		 * translate the rect by the specified offset
		 * @name translate
		 * @memberOf me.Rect
		 * @function
		 * @param {Number} x x offset
		 * @param {Number} y y offset
		 * @return {me.Rect} this rectangle	
		 */
		translate : function(x, y) {
			this.pos.x+=x;
			this.pos.y+=y;
			return this;
		},

		/**
		 * translate the rect by the specified vector
		 * @name translateV
		 * @memberOf me.Rect
		 * @function
		 * @param {me.Vector2d} v vector offset
		 * @return {me.Rect} this rectangle	
		 */
		translateV : function(v) {
			this.pos.add(v);
			return this;
		},

		/**
		 * merge this rectangle with another one
		 * @name union
		 * @memberOf me.Rect
		 * @function
		 * @param {me.Rect} rect other rectangle to union with
		 * @return {me.Rect} the union(ed) rectangle	 
		 */
		union : function(/** {me.Rect} */ r) {
			var x1 = Math.min(this.pos.x, r.pos.x);
			var y1 = Math.min(this.pos.y, r.pos.y);

			this.width = Math.ceil(Math.max(this.pos.x + this.width,
					r.pos.x + r.width)
					- x1);
			this.height = Math.ceil(Math.max(this.pos.y + this.height,
					r.pos.y + r.height)
					- y1);
			this.pos.x = ~~x1;
			this.pos.y = ~~y1;

			return this;
		},

		/**
		 * update the size of the collision rectangle<br>
		 * the colPos Vector is then set as a relative offset to the initial position (pos)<br>
		 * <img src="images/me.Rect.colpos.png"/>
		 * @name adjustSize
		 * @memberOf me.Rect
		 * @function
		 * @param {int} x x offset (specify -1 to not change the width)
		 * @param {int} w width of the hit box
		 * @param {int} y y offset (specify -1 to not change the height)
		 * @param {int} h height of the hit box
		 */
		adjustSize : function(x, w, y, h) {
			if (x != -1) {
				this.colPos.x = x;
				this.width = w;
				this.hWidth = ~~(this.width / 2);
				
				// avoid Property definition if not necessary
				if (this.left !== this.pos.x + this.colPos.x) {
					// redefine our properties taking colPos into account
					Object.defineProperty(this, "left", {
						get : function() {
							return this.pos.x + this.colPos.x;
						},
						configurable : true
					});
				}
				if (this.right !== this.pos.x + this.colPos.x + this.width) {
					Object.defineProperty(this, "right", {
						get : function() {
							return this.pos.x + this.colPos.x + this.width;
						},
						configurable : true
					});
				}
			}
			if (y != -1) {
				this.colPos.y = y;
				this.height = h;
				this.hHeight = ~~(this.height / 2);
				
				// avoid Property definition if not necessary
				if (this.top !== this.pos.y + this.colPos.y) {
					// redefine our properties taking colPos into account
					Object.defineProperty(this, "top", {
						get : function() {
							return this.pos.y + this.colPos.y;
						},
						configurable : true
					});
				}
				if (this.bottom !== this.pos.y + this.colPos.y + this.height) {
					Object.defineProperty(this, "bottom", {
						get : function() {
							return this.pos.y + this.colPos.y + this.height;
						},
						configurable : true
					});
				}
			}
		},

		/**
		 *	
		 * flip on X axis
		 * usefull when used as collision box, in a non symetric way
		 * @ignore
		 * @param sw the sprite width
		 */
		flipX : function(sw) {
			this.colPos.x = sw - this.width - this.colPos.x;
			this.hWidth = ~~(this.width / 2);
		},

		/**
		 *	
		 * flip on Y axis
		 * usefull when used as collision box, in a non symetric way
		 * @ignore
		 * @param sh the height width
		 */
		flipY : function(sh) {
			this.colPos.y = sh - this.height - this.colPos.y;
			this.hHeight = ~~(this.height / 2);
		},
		
		/**
		 * return true if this rectangle is equal to the specified one
		 * @name equals
		 * @memberOf me.Rect
		 * @function
		 * @param {me.Rect} rect
		 * @return {Boolean}
		 */
		equals : function(r) {
			return (this.left 	=== r.left	&& 
					this.right 	=== r.right && 
					this.top 	=== r.top 	&&
					this.bottom === r.bottom);
		},

		/**
		 * check if this rectangle is intersecting with the specified one
		 * @name overlaps
		 * @memberOf me.Rect
		 * @function
		 * @param  {me.Rect} rect
		 * @return {boolean} true if overlaps
		 */
		overlaps : function(r)	{
			return (this.left < r.right && 
					r.left < this.right && 
					this.top < r.bottom &&
					r.top < this.bottom);
		},
		
		/**
		 * check if this rectangle is within the specified one
		 * @name within
		 * @memberOf me.Rect
		 * @function
		 * @param  {me.Rect} rect
		 * @return {boolean} true if within
		 */
		within: function(r) {
			return (r.left <= this.left && 
					r.right >= this.right &&
					r.top <= this.top && 
					r.bottom >= this.bottom);
		},
		
		/**
		 * check if this rectangle contains the specified one
		 * @name contains
		 * @memberOf me.Rect
		 * @function
		 * @param  {me.Rect} rect
		 * @return {boolean} true if contains
		 */
		contains: function(r) {
			return (r.left >= this.left && 
					r.right <= this.right &&
					r.top >= this.top && 
					r.bottom <= this.bottom);
		},
		
		/**
		 * check if this rectangle contains the specified point
		 * @name containsPointV
		 * @memberOf me.Rect
		 * @function
		 * @param  {me.Vector2d} point
		 * @return {boolean} true if contains
		 */
		containsPointV: function(v) {
			return this.containsPoint(v.x, v.y);
		},

		/**
		 * check if this rectangle contains the specified point
		 * @name containsPoint
		 * @memberOf me.Rect
		 * @function
		 * @param  {Number} x x coordinate
		 * @param  {Number} y y coordinate
		 * @return {boolean} true if contains
		 */
		containsPoint: function(x, y) {
			return  (x >= this.left && x <= this.right && 
					(y >= this.top) && y <= this.bottom)
		},

		/**
		 * AABB vs AABB collission dectection<p>
		 * If there was a collision, the return vector will contains the following values: 
		 * @example
		 * if (v.x != 0 || v.y != 0)
		 * { 	
		 *   if (v.x != 0)
		 *   {
		 *      // x axis
		 *      if (v.x<0)
		 *         console.log("x axis : left side !");
		 *      else
		 *         console.log("x axis : right side !");
		 *   }
		 *   else
		 *   {
		 *      // y axis
		 *      if (v.y<0)
		 *         console.log("y axis : top side !");
		 *      else
		 *         console.log("y axis : bottom side !");			
		 *   }
		 *		
		 * }
		 * @ignore
		 * @param {me.Rect} rect
		 * @return {me.Vector2d} 
		 */
		collideVsAABB : function(/** {me.Rect} */ rect) {
			// response vector
			var p = new me.Vector2d(0, 0);

			// check if both box are overlaping
			if (this.overlaps(rect)) {
				// compute delta between this & rect
				var dx = this.left + this.hWidth  - rect.left - rect.hWidth;
				var dy = this.top  + this.hHeight - rect.top  - rect.hHeight;

				// compute penetration depth for both axis
				p.x = (rect.hWidth + this.hWidth) - (dx < 0 ? -dx : dx); // - Math.abs(dx);
				p.y = (rect.hHeight + this.hHeight)
						- (dy < 0 ? -dy : dy); // - Math.abs(dy);

				// check and "normalize" axis
				if (p.x < p.y) {
					p.y = 0;
					p.x = dx < 0 ? -p.x : p.x;
				} else {
					p.x = 0;
					p.y = dy < 0 ? -p.y : p.y;
				}
			}
			return p;
		},

		/**
		 * debug purpose
		 * @ignore
		 */
		draw : function(context, color) {
			// draw the rectangle
			context.strokeStyle = color || "red";
			context.strokeRect(this.left, this.top, this.width, this.height);

		}
	});

	/************************************************************************************/
	/*                                                                                  */
	/*      a matrix Class Object                                                       */
	/*                                                                                  */
	/************************************************************************************/
	/**
	 * a Matrix2d Object.<br>
	 * the identity matrix and parameters position : <br>
	 * <img src="images/identity-matrix_2x.png"/>
	 * @class
	 * @extends Object
	 * @memberOf me
	 * @constructor
	 * @param {Number} a the m1,1 (m11) value in the matrix
	 * @param {Number} b the m1,2 (m12) value in the matrix
	 * @param {Number} c the m2,1 (m21) value in the matrix
	 * @param {Number} d the m2,2 (m12) value in the matrix
	 * @param {Number} e The delta x (dx) value in the matrix
	 * @param {Number} f The delta x (dy) value in the matrix
	 */
	me.Matrix2d = Object.extend(
	/** @scope me.Matrix2d.prototype */	{
	
		/**
		 * the m1,1 value in the matrix (a)
		 * @public
		 * @type Number
		 * @name a
		 * @memberOf me.Matrix2d
		 */
		a : 1,
		
		/**
		 * the m1,2 value in the matrix (b)
		 * @public
		 * @type Number
		 * @name b
		 * @memberOf me.Matrix2d
		 */
		b : 0,

		/**
		 * the m2,1 value in the matrix (c)
		 * @public
		 * @type Number
		 * @name c
		 * @memberOf me.Matrix2d
		 */
		c : 0,

		/**
		 * the m2,2 value in the matrix (d)
		 * @public
		 * @type Number
		 * @name d
		 * @memberOf me.Matrix2d
		 */
		d : 1,

		/**
		 * The delta x value in the matrix (e)
		 * @public
		 * @type Number
		 * @name e
		 * @memberOf me.Matrix2d
		 */
		e : 0,

		/**
		 * The delta y value in the matrix (f)
		 * @public
		 * @type Number
		 * @name f
		 * @memberOf me.Matrix2d
		 */
		f : 0,


		/** @ignore */
		init : function(a, b, c, d, e, f) {
			this.set(a || 1, b || 0, c || 0, d || 1, e || 0, f || 0);	
		},

		/**
		 * reset the transformation matrix to the identity matrix (no transformation).<br>
		 * the identity matrix and parameters position : <br>
		 * <img src="images/identity-matrix_2x.png"/>
		 * @name identity
		 * @memberOf me.Matrix2d
		 * @function
		 * @return {me.Matrix2d} this matrix
		 */
		identity : function() {
			this.set(1, 0, 0, 1, 0, 0);
			return this;
		},

		/**
		 * set the matrix to the specified value
		 * @name set
		 * @memberOf me.Matrix2d
		 * @function
	 	 * @param {Number} a the m1,1 (m11) value in the matrix
	 	 * @param {Number} b the m1,2 (m12) value in the matrix
	 	 * @param {Number} c the m2,1 (m21) value in the matrix
	 	 * @param {Number} d the m2,2 (m22) value in the matrix
	 	 * @param {Number} [e] The delta x (dx) value in the matrix
	 	 * @param {Number} [f] The delta y (dy) value in the matrix
		 * @return {me.Matrix2d} this matrix
		 */
		set : function(a ,b, c, d, e, f) {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.e = e || this.e;
			this.f = f || this.f;
			return this;
		},

	   /**
		* multiply both matrix
		* @name multiply
		* @memberOf me.Matrix2d
		* @function
		* @param {Number} a the m1,1 (m11) value in the matrix
		* @param {Number} b the m1,2 (m12) value in the matrix
		* @param {Number} c the m2,1 (m21) value in the matrix
		* @param {Number} d the m2,2 (m22) value in the matrix
		* @param {Number} [e] The delta x (dx) value in the matrix
		* @param {Number} [f] The delta y (dy) value in the matrix
		* @return {me.Matrix2d} this matrix
		*/
		multiply : function(a, b, c, d, e, f) {
			var a1 = this.a;
			var b1 = this.b;
			var c1 = this.c;
			var d1 = this.d;

			this.a  = a * a1 + b * c1;
			this.b  = a * b1 + b * d1;
			this.c  = c * a1 + d * c1;
			this.d  = c * b1 + d * d1;
			this.e = e * a1 + f * c1 + this.e;
			this.f = e * b1 + f * d1 + this.f;
			return this;
		},

		/**
		 * scale the matrix
		 * @name scale
		 * @memberOf me.Matrix2d
		 * @function
	 	 * @param {Number} sx a number representing the abscissa of the scaling vector.
	 	 * @param {Number} sy a number representing the abscissa of the scaling vector.
		 * @return {me.Matrix2d} this matrix
		 */
		scale : function(sx ,sy) {
		 
			this.a *= sx;
			this.d *= sy;
			
			this.e *= sx;
			this.f *= sy;

			return this;
		},

		/**
		 * rotate the matrix
		 * @name rotate
		 * @memberOf me.Matrix2d
		 * @function
	 	 * @param {Number} a an angle representing the angle of the rotation. A positive angle denotes a clockwise rotation, a negative angle a counter-clockwise one.
		 * @return {me.Matrix2d} this matrix
		 */
		rotate : function(angle) {
			if (angle !== 0) {
				var cos = Math.cos(angle);
				var sin = Math.sin(angle);
				var a = this.a;
				var b = this.b;
				var c = this.c;
				var d = this.d;
				var e = this.e;
				var f = this.f;
				this.a = a * cos - b * sin;
				this.b = a * sin + b * cos;
				this.c = c * cos - d * sin;
				this.d = c * sin + d * cos;
				this.e = e * cos - f * sin;
				this.f = e * sin + f * cos;
			}
			return this;
		},


		/**
		 * translate the matrix
		 * @name translate
		 * @memberOf me.Matrix2d
		 * @function
	 	 * @param {me.Vector2d} x the x coordindates to translate the matrix by
	 	 * @param {me.Vector2d} y the y coordindates to translate the matrix by
		 * @return {me.Matrix2d} this matrix
		 */
		translate : function(x, y) {
			this.e += x;
			this.f += y;

			return this;
		},

		/**
		 * translate the matrix the matrix
		 * @name translateV
		 * @memberOf me.Matrix2d
		 * @function
	 	 * @param {me.Vector2d} v the vector to translate the matrix by
		 * @return {me.Matrix2d} this matrix
		 */
		translateV : function(v) {
			return this.translate(v.x, v.y);
		},

		/**
	 	 * returns true if the matrix is an identity matrix.
		 * @name isIdentity
		 * @memberOf me.Matrix2d
		 * @function
	 	 * @return {Boolean}
	 	 **/
		isIdentity : function() {
			return (this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1 && this.e == 0 && this.f == 0);
		},



		 /**
		   * Clone the Matrix
		   * @return {me.Matrix2d}
		   */
		 clone : function() {
		 	return new me.Matrix2d(this.a, this.b, this.c, this.d, this.e, this.f);
		 }
		
	
	});

	/*---------------------------------------------------------*/
	// END END END
	/*---------------------------------------------------------*/
})(window);
