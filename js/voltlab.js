    
    digit_img = [];
    cyfry = ['img/0.png','img/1.png','img/2.png','img/3.png','img/4.png','img/5.png','img/6.png','img/7.png','img/8.png','img/9.png'];
    cyfry.forEach(function(item, index, array)	{
        digit_img.push(new Image());
        digit_img[digit_img.length - 1].src = item;
    });
    battery_img = new Image();
	battery_img.src = 'img/battery.png';
    left_pin_img = new Map();

    left_pin_red = new Image();
	left_pin_red.src = 'img/red.png';
    left_pin_img.set("red", left_pin_red)

    left_pin_green = new Image();
	left_pin_green.src = "img/green.png";
    left_pin_img.set("green", left_pin_green)

    left_pin_blue = new Image();
	left_pin_blue.src = "img/blue.png";
    left_pin_img.set("blue", left_pin_blue)
    background_img = new Image();
	background_img.src = 'img/voltlab.png';
    pin_connections_img = [
        [ new Image(),new Image(),new Image()],
        [ new Image(),new Image(),new Image()],
        [ new Image(),new Image(),new Image()]
    ];
    pin_connections_img[0][0].src = "img/reda.png";
    pin_connections_img[0][1].src = "img/redb.png";
    pin_connections_img[0][2].src = "img/redc.png";
    pin_connections_img[1][0].src = "img/greena.png";
    pin_connections_img[1][1].src = "img/greenb.png";
    pin_connections_img[1][2].src = "img/greenc.png";
    pin_connections_img[2][0].src = "img/bluea.png";
    pin_connections_img[2][1].src = "img/blueb.png";
    pin_connections_img[2][2].src = "img/bluec.png";
    var key_switch_sound = new Audio('audio/key_switch.mp3');
    var switch_sound = new Audio('audio/switch.mp3');
    var loading_sound = new Audio('audio/loading.mp3');


    class LeftPin
    {
        position;
        value;
        ctx;
        connections = [false, false, false];
        focus = -1;
        constructor(context, pos, scaleX, scaleY) {
            this.ctx = context;
            this.position = pos;
            this.value = 1+ Math.floor(Math.random() * 9);
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        draw_connections()
        {
            var focus_and_connections = [];
            this.connections.forEach(function(item, index, array)	{
                focus_and_connections.push(item);
            });
            if(this.focus >= 0 && this.focus <= 2)
            {
                focus_and_connections[this.focus] = true;
            }

            var self = this;
            focus_and_connections.forEach(function(item, index, array)	{
                if(item)
                {
                    self.ctx.drawImage(pin_connections_img[self.position][index], 0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
                }
            });
        }
        right_control()
        {
            this.focus = this.focus + 1;
            if(this.focus == 3)
            {
                this.focus = 0;
            }
        }
        left_control()
        {
            this.focus = this.focus - 1;
            if(this.focus == -1)
            {
                this.focus = 2;
            }
        }
        get_connection_index()
        {
            if(this.connections[0] == true)
            { return 0; }
            if(this.connections[1] == true)
            { return 1; }
            if(this.connections[2] == true)
            { return 2; }
            else { return -1; }
        }
        is_connected()
        {
            if(this.connections[0] == true)
            return true;
            else if(this.connections[1] == true)
            return true;
            else if(this.connections[2] == true)
            return true;
            else return false;
        }
    }
    
	class VoltLab {
        cyfraWidth = 83;
        cyfraHeight = 106;
        targetValue = ['1','2','3'];
        multipliers = ['1','10','50'];
        target = 0;
        result = 0;
        focusKey = 0;
        batteries = 6;
        battery_charge = 6;
        is_end = false;
        left_pins;
		constructor() {
			this.layerBackground = document.getElementById("layerBackground");
            this.layerBattery = document.getElementById("layerBattery");
            this.layerResult = document.getElementById("layerResult");
            this.layerConnections = document.getElementById("layerConnections");

            this.baseWidth = 1013;
            this.baseHeight = 859;

            this.layerBackgroundCtx = this.layerBackground.getContext("2d");
            this.layerBatteryCtx = this.layerBattery.getContext("2d");
            this.layerResultCtx = this.layerResult.getContext("2d");
            this.layerConnectionsCtx = this.layerConnections.getContext("2d");

            this.scaleX = 1; 
            this.scaleY = 1;
            this.left_pins = [new LeftPin(this.layerConnectionsCtx,0, this.scaleX, this.scaleY),new LeftPin(this.layerConnectionsCtx,1, this.scaleX, this.scaleY),new LeftPin(this.layerConnectionsCtx,2, this.scaleX, this.scaleY)];
            this.left_pins[0].focus=0;
			this.generate_key();
            this.generate_multipliers();
            
            window.addEventListener('resize', this.resizeCanvas.bind(this), false);
            this.resizeCanvas();
		}
        start()
        {
            this.draw_layerBackground();
            this.draw_layerBattery();
            this.draw_layerResult();
            this.draw();
            window.addEventListener('keydown',this.check.bind(this),false);
            this.time_event_battery();
        }
        resizeCanvas() {
            const scene = document.getElementById("scene");
            const aspectRatio = this.baseWidth / this.baseHeight;
            let newWidth = scene.clientWidth;
            let newHeight = scene.clientHeight;

            if (newWidth / newHeight > aspectRatio) {
                newWidth = newHeight * aspectRatio;
            } else {
                newHeight = newWidth / aspectRatio;
            }

            this.currentWidth = newWidth;
            this.currentHeight = newHeight;
            this.scaleX = this.currentWidth / this.baseWidth;
            this.scaleY = this.currentHeight / this.baseHeight;

            this.layerBackground.width = this.currentWidth;
            this.layerBackground.height = this.currentHeight;
            this.layerBattery.width = this.currentWidth;
            this.layerBattery.height = this.currentHeight;
            this.layerResult.width = this.currentWidth;
            this.layerResult.height = this.currentHeight;
            this.layerConnections.width = this.currentWidth;
            this.layerConnections.height = this.currentHeight;

            this.left_pins.forEach(pin => {
                pin.scaleX = this.scaleX;
                pin.scaleY = this.scaleY;
            });

            this.draw();
            this.draw_layerBackground();
            this.draw_layerBattery();
            this.draw_layerResult();
        }
        animation_connections()
        {
            document.getElementById("layerConnections").animate([
                { opacity: '1' },
                { opacity: '0.4' }
              ], {
                duration: 200,
                iterations: 3
              });
        }
		check(e) {
            if(!this.is_end)
            {
                var code = e.keyCode;
                switch (code) {
		case 37: 
                    key_switch_sound.play();
                    this.left_pins[this.focusKey].focus = -1;
                    this.up_control(); 
                    this.left_pins[this.focusKey].focus = 0; 
                    this.draw(); 
                    break; 
                case 38: 
					key_switch_sound.play();
                    this.left_pins[this.focusKey].left_control(); 
                    this.draw(); 
                    break; 
                case 39: 
					key_switch_sound.play();
                    this.left_pins[this.focusKey].focus = -1; 
                    this.down_control(); 
                    this.left_pins[this.focusKey].focus = 0; 
                    this.draw(); 
                break; 
                case 40: 
                    key_switch_sound.play();
                    this.left_pins[this.focusKey].right_control();
                    this.draw(); 
                    break; 
                case 13: 
                    if(this.left_pins[this.focusKey].connections[0] == false && this.left_pins[this.focusKey].connections[1] == false &&
                        this.left_pins[this.focusKey].connections[2] == false)
                        {
                            if(this.left_pins[0].connections[this.left_pins[this.focusKey].focus] +
                            this.left_pins[1].connections[this.left_pins[this.focusKey].focus] +
                            this.left_pins[2].connections[this.left_pins[this.focusKey].focus] == 0)
                            {
                                this.left_pins[this.focusKey].connections[this.left_pins[this.focusKey].focus] = true;
                                this.animation_connections();
                                switch_sound.play();
                                this.check_end();
                            }
                        }
                break;
                    }
            }
		}
        sub_battery_charge()
        {
            this.battery_charge = this.battery_charge - 1;
            this.check_end();
            if(this.battery_charge < 0)
            {
                this.battery_charge = 6;
                this.batteries = this.batteries - 1;
                
                this.draw_layerBattery();
            }
        }
        time_event_battery()
        {
            if(!this.is_end)
            {
                var self = this;
                window.setTimeout(function() {
                    self.sub_battery_charge();
                    self.time_event_battery();
                }, 500); 
            }
        }
        check_end()
        {
            if(!this.is_end)
	    {
		this.calculate_result();
		    if(this.batteries == 0 && this.battery_charge <= 4)
		    {
			this.fail_end();
		    }
		    if(this.left_pins[0].is_connected() + this.left_pins[1].is_connected() + this.left_pins[2].is_connected() == 3)
		    {
			if(this.result == this.target)
			{
			    this.success_end();
			}else
			this.fail_end();
		    }    
	    }
        }
        
        success_end()
        {
            this.is_end = true;
            loading_sound.play();
            document.getElementById("scene").style.display="none";
            window.removeEventListener('keydown',this.check.bind(this),false);
            document.getElementById("goodEnding").style.display="block";
        }
        fail_end()
        {
            this.is_end = true;
            loading_sound.play();
            document.getElementById("scene").style.display="none";
            window.removeEventListener('keydown',this.check.bind(this),false);
            document.getElementById("badEnding").style.display="block";
        }
		generate_key()
		{
			this.left_pins[0].value = 1+ Math.floor(Math.random() * 9);
			this.left_pins[1].value = 1+ Math.floor(Math.random() * 9);
			this.left_pins[2].value = 1+ Math.floor(Math.random() * 9);
			this.target = this.left_pins[0].value*1 + this.left_pins[1].value*10 + this.left_pins[2].value*50;
			if(this.target < 100)
			{
				this.targetValue[0] = 0;
				this.targetValue[1] = (''+this.target)[0];
				this.targetValue[2] = (''+this.target)[1];
			}else
			{
				this.targetValue[0] = (''+this.target)[0];
				this.targetValue[1] = (''+this.target)[1];
				this.targetValue[2] = (''+this.target)[2];
			}
		}
        down_control()
        {
            this.focusKey = this.focusKey + 1;
            if(this.focusKey > 2)
            {
                this.focusKey = 0;
            }
            this.draw();
        }
        up_control()
        {
            this.focusKey = this.focusKey - 1;
            if(this.focusKey < 0)
            {
                this.focusKey = 2;
            }
            this.draw();
        }
        calculate_result()
        {
            this.result = 0;
            for(var i = 0; i < 3; i++)
            {
                if(this.left_pins[i].get_connection_index() != -1)
                {
                    this.result = this.result + this.left_pins[i].value*this.multipliers[this.left_pins[i].get_connection_index()];
                }
            }
        }
        generate_multipliers()
        {
            this.multipliers = this.multipliers.sort(() => Math.random() - 0.5);
        }
		draw_layerBackground()
		{
            this.layerBackgroundCtx.clearRect(0, 0, this.currentWidth, this.currentHeight);
            this.layerBackgroundCtx.drawImage(background_img, 0, 0, this.currentWidth, this.currentHeight);
            this.draw_target();
            this.draw_left_pin_numbers();
		}
		draw_target()
		{
            const x1 = this.scaleX * 384;
            const y = this.scaleY * 34;
            const digitWidth = this.scaleX * this.cyfraWidth;
            const digitHeight = this.scaleY * this.cyfraHeight;

            this.layerBackgroundCtx.drawImage(digit_img[parseInt(this.targetValue[0])], x1, y, digitWidth, digitHeight);
            this.layerBackgroundCtx.drawImage(digit_img[parseInt(this.targetValue[1])], x1 + digitWidth, y, digitWidth, digitHeight);
            this.layerBackgroundCtx.drawImage(digit_img[parseInt(this.targetValue[2])], x1 + digitWidth * 2, y, digitWidth, digitHeight);
		}  
        draw_layerResult()
		{
            this.layerResultCtx.clearRect(0, 0, this.currentWidth, this.currentHeight);
            
            this.calculate_result();

            var t_result = this.result;
            if(this.left_pins[this.focusKey].focus != -1)
            {
                if(this.left_pins[this.focusKey].connections[this.left_pins[this.focusKey].focus] == false)
                this.result = this.result + this.left_pins[this.focusKey].value*this.multipliers[this.left_pins[this.focusKey].focus];
            }
            
            const x = this.scaleX * 384;
            const y = this.scaleY * 714;
            const digitWidth = this.scaleX * this.cyfraWidth;
            const digitHeight = this.scaleY * this.cyfraHeight;

            if(this.result < 10){
                this.layerResultCtx.drawImage(digit_img[0], x, y, digitWidth, digitHeight);
                this.layerResultCtx.drawImage(digit_img[0], x + digitWidth, y, digitWidth, digitHeight);
                this.layerResultCtx.drawImage(digit_img[this.result], x + digitWidth * 2, y, digitWidth, digitHeight);
            }else if(this.result < 100){
                this.layerResultCtx.drawImage(digit_img[0], x, y, digitWidth, digitHeight);
                this.layerResultCtx.drawImage(digit_img[parseInt((''+this.result)[0])], x + digitWidth, y, digitWidth, digitHeight);
                this.layerResultCtx.drawImage(digit_img[parseInt((''+this.result)[1])], x + digitWidth * 2, y, digitWidth, digitHeight);
            }else{
                this.layerResultCtx.drawImage(digit_img[parseInt((''+this.result)[0])], x, y, digitWidth, digitHeight);
                this.layerResultCtx.drawImage(digit_img[parseInt((''+this.result)[1])], x + digitWidth, y, digitWidth, digitHeight);
                this.layerResultCtx.drawImage(digit_img[parseInt((''+this.result)[2])], x + digitWidth * 2, y, digitWidth, digitHeight);
            }
            this.result = t_result;
		}
		draw_left_pin_numbers()
		{
            const pinX = this.scaleX * 67;
            const pinWidth = this.scaleX * this.cyfraWidth;
            const pinHeight = this.scaleY * this.cyfraHeight;

            this.layerBackgroundCtx.drawImage(digit_img[this.left_pins[0].value], pinX, this.scaleY * 167, pinWidth, pinHeight);
            this.layerBackgroundCtx.drawImage(digit_img[this.left_pins[1].value], pinX, this.scaleY * 375, pinWidth, pinHeight);
            this.layerBackgroundCtx.drawImage(digit_img[this.left_pins[2].value], pinX, this.scaleY * 583, pinWidth, pinHeight);
		}
		draw_left_pin_focused_color()
		{
            const pinX = this.scaleX * 62;
            const pinWidth = this.scaleX * left_pin_img.get("red").width;
            const pinHeight = this.scaleY * left_pin_img.get("red").height;

			if(this.focusKey == 0){
                this.layerConnectionsCtx.drawImage(left_pin_img.get("red"), pinX, this.scaleY * 164, pinWidth, pinHeight);
			}
			if(this.focusKey == 1){
                this.layerConnectionsCtx.drawImage(left_pin_img.get("green"), pinX, this.scaleY * 372, pinWidth, pinHeight);
			}
			if(this.focusKey == 2){
                this.layerConnectionsCtx.drawImage(left_pin_img.get("blue"), pinX, this.scaleY * 581, pinWidth, pinHeight);
			}
		}
        draw_left_pin_connections()
        {
            
            this.layerConnectionsCtx.clearRect(0, 0, this.currentWidth, this.currentHeight);

            var self = this;
            this.left_pins.forEach(function(item, index, array)	{
                item.scaleX = self.scaleX;
                item.scaleY = self.scaleY;
                item.draw_connections();
            });    
        }
        draw_layerBattery()
        {
            this.layerBatteryCtx.clearRect(0, 0, this.currentWidth, this.currentHeight);
            const batWidth = this.scaleX * battery_img.width;
            const batHeight = this.scaleY * battery_img.height;
            for (var i = 0; i < this.batteries; i++) {
                this.layerBatteryCtx.drawImage(battery_img, this.scaleX * (277 - i*19), this.scaleY * 747, batWidth, batHeight);
            }
        }
		draw() 
		{
            this.draw_left_pin_connections();
			this.draw_left_pin_focused_color();
            this.draw_layerResult();
		}
		
    }
        


	
	
		
	
	
	
