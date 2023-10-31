const epsilon0 = 8.854187817e-12;
const pi = Math.PI;

$(document).ready(function() {
    var plano = $('#canva');
    var radioInfiniteSurface = $('#infinite-surface');
    var radioSphere = $('#sphere');
    var divInformationSphere = $('#sphere-information');
    var divIformationSurface = $('#infinite-surface-information');
    var surfaceChargeDensityIntput = $('#charge-density');
    var radiusInput = $('#radius');
    var electricChargeInput = $('#electric-charge');
    var particleChargeInput = $('#particle-charge');
    var particleMassInput = $('#particle-mass');
    var particleInitialVelocityInput = $('#initial-velocity');
    var mainButton = $('#main-button');
    var surfaceCanva = $('#surface-canva');
    var sphereCanva = $('#sphere-canva');
    var maxHeightInformation = $('#max-height-information');
    var maxHeightText = $('#max-height');
    var maxVelocityInformation = $('#max-velocity-information');
    var maxVelocityText = $('#max-velocity');
    var electron = $('#electron');
    var muon = $('#muon');
    var tauon = $('#tauon');
    var negpions = $('#negpions');
    var antiproton = $('#antiproton');
    var blackHole = $('#black-hole');
    var controlPanel = $('.control-panel')


    function createParticle(x,y,initialVelocity, maxVelocity, maxHeight) {

        var particle = $('<div class="particle"></div>');
        plano.append(particle); 
        
        particle.css({
            left: x + 'px',
            top: y + 'px'
        });
        
        if(radioSphere.is(":checked")){
            if (initialVelocity >= maxVelocity) {
                maxHeightInformation.removeClass("hidden");
                maxVelocityInformation.removeClass("hidden");
                maxHeightText.text("The particle escaped.");
                maxVelocityText.text("Escape velocity: " + maxVelocity);
                particle.animate({
                    top: '-200px' 
                }, 1000, function() {
                    $(this).remove(); 
                });
            } else {
                maxHeightInformation.removeClass("hidden");
                maxVelocityInformation.removeClass("hidden");
                maxHeightText.text("Maximum height: "+ maxHeight + " m.");
                maxVelocityText.text("Escape velocity: " + maxVelocity);
                particle.animate({
                    top: '50px' 
                }, 500, function() {
                    particle.animate({
                        top: y + 'px'
                    }, 500, function() {
                        $(this).remove();
                    });
                });
            }
        }else if(radioInfiniteSurface.is(":checked")){
            maxHeightInformation.removeClass("hidden");
            maxVelocityInformation.addClass("hidden");
            maxHeightText.text("Maximum height: "+ maxHeight + " m.");
            particle.animate({
                top: '50px' 
            }, 500, function() {
                particle.animate({
                    top: y + 'px'
                }, 500, function() {
                    $(this).remove();
                });
            });
        }
        
    }

    radioInfiniteSurface.click(function(){
        divInformationSphere.addClass("hidden");
        divIformationSurface.removeClass("hidden");
        sphereCanva.addClass("hidden");
        surfaceCanva.removeClass("hidden");
    });

    radioSphere.click(function(){
        divInformationSphere.removeClass("hidden");
        divIformationSurface.addClass("hidden");
        sphereCanva.removeClass("hidden");
        surfaceCanva.addClass("hidden");
    });

    radiusInput.change(function(){
        var radius = radiusInput.val()/2;
        sphereCanva.css({
            "width": (Math.log10(radius)*50+20)+"px",
            "height": (Math.log10(radius)*50+20)+"px",
        });
    });


    mainButton.click(function(){

        maxHeightInformation.addClass("hidden")
        var initialVelocity = particleInitialVelocityInput.val()
        var density = surfaceChargeDensityIntput.val();
        var q = particleChargeInput.val();
        var Q = electricChargeInput.val();
        var mass = particleMassInput.val();
        var v = particleInitialVelocityInput.val();
        var maxHeight;

        const charge_particle = 1.602176634e-19;
        const mass_electron = 9.109e-31;
        const mass_muon = 1.883e-28;
        const mass_tauon = 3.167e-27;
        const mass_negpion = 2.488e-28;
        const mass_antiproton = 1.673e-27;

        if(v <= 299792.458){
            if(radioSphere.is(":checked")){

                var radius = radiusInput.val()/2;
                var umbral;

                if(electron.is(":checked")){
                    mass = mass_electron;
                    q = charge_particle;
                }if(muon.is(":checked")){
                    mass = mass_muon;
                    q = charge_particle;
                }if(tauon.is(":checked")){
                    mass = mass_tauon;
                    q = charge_particle;
                }if(negpions.is(":checked")){
                    mass = mass_negpion;
                    q = charge_particle;
                }if(antiproton.is(":checked")){
                    mass = mass_antiproton;
                    q = charge_particle;
                }
                umbral = escapeVelocity(q,Q,mass,radius);
                if(umbral > 299792.458){
                    plano.css({
                        "width": "0px",
                        "height": "0px",
                    });
                    controlPanel.addClass("hidden")
                    blackHole.removeClass("hidden");
                    blackHole.animate({ opacity: 1 }, 1000);
                }else{
                    maxHeight = maxHeightSphere(v,mass,q,Q);
                    createParticle(245,500 - (Math.log10(radius)*50+20),initialVelocity, umbral, maxHeight);
                }
                
                
    
            }else if(radioInfiniteSurface.is(":checked")){
                if(electron.is(":checked")){
                    mass = mass_electron;
                    q = charge_particle;
                }if(muon.is(":checked")){
                    mass = mass_muon;
                    q = charge_particle;
                }if(tauon.is(":checked")){
                    mass = mass_tauon;
                    q = charge_particle;
                }if(negpions.is(":checked")){
                    mass = mass_negpion;
                    q = charge_particle;
                }if(antiproton.is(":checked")){
                    mass = mass_antiproton;
                    q = charge_particle;
                }
                maxHeight = maxHeightSurface(mass,v,q,density);
                console.log(mass,v,q,density);
                createParticle(245,480,initialVelocity, 0, maxHeight);
    
            }
        }else{
            alert("The velocity must be less than the speed of light.");
        }

        electron.prop("checked", false);
        muon.prop("checked", false);
        tauon.prop("checked", false);
        negpions.prop("checked", false);
        antiproton.prop("checked", false);
        
    });

});


function maxHeightSurface(mass, initialVelocity, q, density){
    var maxHeight = (mass * (initialVelocity*initialVelocity)* epsilon0)/(q*density);
    return maxHeight;
}

function escapeVelocity(q, Q, mass, r){
    var escapeVelocity = Math.sqrt((q*Q*mass)/(2 * pi * epsilon0 * r));
    return escapeVelocity;
}

function maxHeightSphere(v,m,q,Q){
    var maxHeight = (2*q*Q)/(4*pi*epsilon0*m*v)
    return maxHeight;
}
