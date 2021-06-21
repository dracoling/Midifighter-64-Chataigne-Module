// -- setup
local.sendCC(3, 3, 0); //Force "Bank 1" Mode on Midi Fighter 64
 
// -- internal functions
function setLed(led, color)
{
    local.sendNoteOn(3, led+35, color);
}

// -- commands for use in UI
function setButtonColor(button, color)
{
    setLed(button, color);
}

function resetColors()
{
    for(var i=1;i<65;i++) setLed(i,0);
}

// -- events
function moduleParameterChanged(param)
{
    if(param.getParent().name == "buttonColors")
    {
        var id = parseInt(param.niceName.split(' ')[1]);
        var val = param.get();
        setLed(id, val[0]);
    }
}

function noteOnEvent(channel, pitch, velocity)
{
    script.log("Note on " + channel + ", " + pitch + ", " + velocity);
    if (channel == 3) {
        var buttonId = pitch - 35;
        var buttonDown = ((velocity > 0) ? 1 : 0);
        local.values.buttons.getChild("button" + buttonId).set(buttonDown);
    }
}

function noteOffEvent(channel, pitch, velocity)
{
    script.log("Note off " + channel + ", " + pitch + ", " + velocity);
    // Shouldn't be getting Note Off Events, but we'll use them as offs anyway
    if (channel == 3) {
        var buttonId = pitch - 35;
        local.values.buttons.getChild("button" + buttonId).set(0);
    }
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