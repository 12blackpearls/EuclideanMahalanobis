

    //---START READ FILE---
    var alldata;
    var indexfirst;
    var indexsecond;
    var dimension = 0;

    $(document).ready(function() {
        if(isAPIAvailable()) {
        $('#files').bind('change', handleFileSelect);
        }
    });

    function isAPIAvailable() {
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        return true;
        } else {
        // source: File API availability - http://caniuse.com/#feat=fileapi
        // source: <output> availability - http://html5doctor.com/the-output-element/
        document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
        // 6.0 File API & 13.0 <output>
        document.writeln(' - Google Chrome: 13.0 or later<br />');
        // 3.6 File API & 6.0 <output>
        document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
        // 10.0 File API & 10.0 <output>
        document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
        // ? File API & 5.1 <output>
        document.writeln(' - Safari: Not supported<br />');
        // ? File API & 9.2 <output>
        document.writeln(' - Opera: Not supported');
        return false;
        }
    }

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var file = files[0];
        // read the file metadata
        var output = ''
            output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
            output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
            output += ' - FileSize: ' + file.size + ' bytes<br />\n';
            output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';
        // read the file contents
        printTable(file);
        // post the results
        $('#list').append(output);
    }

    function printTable(file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        alldata = data;
        var html = '';
        for(var row in data) {
            html += '<tr>\r\n';
            for(var item in data[row]) {
            html += '<td>' + data[row][item] + '</td>\r\n';
                        dimension = item;
            }
            html += '</tr>\r\n';
        }
        
        $('#contents').html(html);
        //checking();
        };
        reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
    }
    //---END READ FILE---

    //---START GET INPUT TO COUNT---
    $('#form-id').submit(function(event) {
        indexfirst = $('#indexfirst').val();
        indexsecond = $('#indexsecond').val();
        // console.log(alldata[indexfirst][1]);
        // console.log(alldata[indexfirst][2]);
        event.preventDefault();
    });
    //---END GET INPUT TO COUNT---

    //---START COUNT EUCLIDEAN DISTANCE---
    document.getElementById("euclidean").addEventListener("click", function() {
        if(indexfirst==null && indexsecond==null) {
            alert("Anda belum memasukkan titik yang akan dihitung!");
        } else {
            var totalEuc = Math.pow(alldata[indexfirst-1][1]-alldata[indexsecond-1][1],2) + Math.pow(alldata[indexfirst-1][2]-alldata[indexsecond-1][2],2);
            var fixEuc = Math.sqrt(totalEuc);
            console.log(fixEuc);
        }
    });
    //---END COUNT EUCLIDEAN DISTANCE---

        //---START COUNT MAHALANOBIS DISTANCE---
        document.getElementById("mahalanobis").addEventListener("click", function() {
        if(indexfirst==null && indexsecond==null) {
            alert("Anda belum memasukkan titik yang akan dihitung!");
        } else {
            //count Covariance Matrix
                var average = [];
                for(var x = 0; x < dimension; x++) {
                    average[x] = 0;
                    for(var y = 0; y < alldata.length; y++) {
                        average[x] = +average[x] + +alldata[y][x+1]; 
                    }
                    
                    average[x] = +average[x] / +alldata.length;
                    //console.log(average[x]);
                }
                //console.log(dimension); 
                //console.log(alldata.length);
                var tempo = 0;
                var covmat = []; 
                for(var x = 0; x < dimension; x++) {
                    for(var y = 0; y < dimension; y++) {
                        covmat[x] = [];
                        tempo = 0;
                        for(var z = 0; z < alldata.length; z++) {
                            tempo = +tempo + (+alldata[z][x+1] - +average[x]) * (+alldata[z][y+1] - +average[y]);
                        }
                        //console.log(tempo);
                        covmat[x][y] = +tempo / (+alldata.length-1);
                        //console.log(covmat[x][y]);
                    }
                    //console.log(tempo);
                }

                //inverse covariance matrix
                var m = require('simplematrix');
                var a = new m.Matrix(covmat);
                var a_inv = a.inverse();
        }
    });
        //---END COUNT MAHALANOBIS DISTANCE---
