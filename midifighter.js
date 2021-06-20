// -- setup
local.sendCC(3, 3, 0); //Force "Bank 1" Mode on Midi Fighter 64
 
// -- internal functions
function setLed(led, color, animation)
{
    local.sendNoteOn(3, led+35, color);
    local.sendNoteOn(4, led, animation);
}

// -- commands for use in UI
function setButtonColor(button, color, flashing)
{
    animation = 0;
    if (flashing) { animation = 38; } // flash every beat
    setLed(button, color, animation);
}

function resetColors()
{
    for(var i=1;i<65;i++) setLed(i,0,0);
}

// -- events
function moduleParameterChanged(param)
{
    if(param.getParent().name == "buttonColors")
    {
        var id = parseInt(param.name.substring(6));
        var val = param.getData();
        setLed(id, val[0], 0);
    }
}

function noteOnEvent(channel, pitch, velocity)
{
    script.log("Note on " + channel + ", " + pitch + ", " + velocity);
    if (channel == 3) {
        var buttonId = pitch - 35;
        var buttonDown = ((velocity > 0) ? true : false);
        local.values.buttons.getChild("buttons" + buttonId).set(buttonDown);
    }
}

function noteOffEvent(channel, pitch, velocity)
{
    script.log("Note off " + channel + ", " + pitch + ", " + velocity);
    // Shouldn't be getting Note Off Events
}

function ccEvent(channel, number, value)
{
    script.log("Control change " + channel + ", " + number + ", " + value);
    // Don't care about CC Events
}

function sysExEvent(data)
{
    script.log("SysEx message (" + data.length + " bytes) :");
    for(var i=0; i < data.length; i++) {
        script.log(" > "+data[i]);
    }
}