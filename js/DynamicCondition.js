var DynamicCondition = (function () {
    var module = {};
    var numOfParticipants = 0;
    var numGrpTechnique = 0;
    var numGrpVisibility = 0; 
    var numGrpGranularity = 0;
    
    module.setNumberOfParticipants = function(num) {
        // Set number of participants
        // MUST set before generate anything
        numOfParticipants = num;
    }
    
    module.setNumberGroupTechniques = function(num) {
        // Set number of techniques in each group
        // e.g. num = 7 
        // means after 7 counts of technique A,
        // the next count will be technique B
        // MUST set before generate anything
        numGrpTechnique = num;
    }
    
    /*
    * This is defined based on your third independent variable
    */
    module.setNumberGroupVisibility = function(num) {
        // MUST set before generate anything
        numGrpVisibility = num;
    }
    
    module.setNumberGroupGranularity = function(num) {
        // Set number of techniques in each group
        // e.g. num = 3
        // means after 3 counts of granularity A,
        // the next count will be granularity B
        // MUST set before generate anything
        numGrpGranularity = num;
    }
    
    /*
    * Generates first ordering of all participants 
    * (e.g. P01, P02 ... , Px) s.t. x = max number of participants
    * without the combination of trials
    *
    * @param {Array} tArray   Array of techniques (i.e. T1: [XWin, ACP], T2: [ACP, XWin])
    * @param {Array} vArray   Array of visibility (i.e. [V1: [...], V2: [...]])
    * @param {Array} gArray   Array of granularity (i.e. [G1: [...], G2: [...], G3: [...]])
    *
    * @return {Array} Returns an array of all participants with order. (i.e. P01 -> T1, V1, G1)
    */
    module.generateParticipantOrder = function(tArray, vArray, gArray) {
        var pData = {};
        var p_count = 0;
        var t_count = 0; var t_index = 0
        var v_count = 0; var v_index = 0;
        var g_count = 0; var g_index = 0;
        
        for(var i=0; i< numOfParticipants; i++) {
             
            if (t_count == numGrpTechnique) t_index = 1;

            if (v_count == numGrpVisibility) {
                if (v_index == 0) {
                    v_index = 1;
                } else {
                    v_index = 0;
                }
                // reset visibility counter
                v_count = 0; 
            }

            if (g_count == numGrpGranularity && g_index == numGrpGranularity) {
                // reset granularity counter and index
                g_count = 0;
                g_index = 0;
            }

            // save the combinations
            pData[p_count] = {t_index, v_index, g_index};

            t_count++;
            v_count++;
            g_count++; g_index++;

            // increment participant counter
            p_count++;
        }
        return pData;
    }
    
    /*
    * Generates all trials based on conditions a specific participant
    * i.e. 1 participant has 12 conditions -> 36 trials (12 x 3 trials each)
    *
    * @param {Array} tArray   Array of specific group of techniques (i.e. [XWin, ACP])
    * @param {Array} vArray   Array of specific group of visibility (i.e. [visible, invisible])
    * @param {Array} gArray   Array of specific group of granularity (i.e. [phrase, sentence, paragraph])
    *
    * @return {Array} Returns an array of all trials.
    */
    module.generateCondition = function (trialArray, tArray, vArray, gArray, 
                                   blockArray) {
        var cData = {};
        var experiments = [];
        var t_count = 0; var t_index = 0;
        var v_count = 0; var v_index = 0;
        var g_count = 0; var g_index = 0;
        
        for(var i=0; i< numOfParticipants; i++) {
            if (t_count == numGrpTechnique) t_index = 1;

            if (v_count == numGrpVisibility) {
                if (v_index == 0) {
                    v_index = 1;
                } else {
                    v_index = 0;
                }
                v_count = 0; 
            }

            if (g_count == numGrpGranularity && g_index == numGrpGranularity) {
                g_count = 0;
                g_index = 0;
            }

            // each block has different order of trials
            var g_trials = [];
            blockArray.forEach(function(index) {
                g_trials.push(trialArray[gArray[g_index]][index]);
            }); 

//            console.log(g_trials);

            Object.keys(g_trials).forEach(function(key) {
//                console.log(key, g_trials[key]);
                
                // Try to mimic the same experiments structure as given  
                var experiment = {  
                    "technique": tArray[t_index], 
                    "granularity": gArray[g_index],
                    "visibility": vArray[v_index],
                    "data_file": "data/texts.json",
                    "stimuli": g_trials[key].stimuli 
                }; 

                experiments.push(experiment);
//                console.log(tArray[t_index] + ", " + vArray[v_index] + ", " + gArray[g_index], ", " + g_trials[key].description);
            });

            t_count++;
            v_count++;
            g_count++; g_index++;
        } 

        cData["experiments"] = experiments
//        console.log(cData);
        return cData;
    }
    
    return module;
})();