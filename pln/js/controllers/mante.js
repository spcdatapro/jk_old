angular.module('cpm')
.controller('MntEmpleadoController', ['$scope', '$http', 'empServicios', 'empresaSrvc', 'proyectoSrvc', 'cuentacSrvc', 'pstServicios', 
	function($scope, $http, empServicios, empresaSrvc, proyectoSrvc, cuentacSrvc, pstServicios){
		$scope.formulario  = false;
		$scope.resultados  = false;
		$scope.empleados   = [];
		$scope.inicio      = 0;
		$scope.datosbuscar = [];
		$scope.buscarmas   = true;
        $scope.hay       = false;
        $scope.archivos  = [];
        $scope.empresas  = [];
        $scope.proyectos = [];
        $scope.cuentas   = [];
        $scope.puestos   = [];
        $scope.archivotipo = [];

		$scope.mostrarForm = function() {
			$scope.emp = {};
			$scope.formulario = true;
            $scope.hay = false;
		};

		$scope.guardar = function(emp){
            if ($scope.emp.fchnac) {
                $scope.emp.fechanacimiento = $scope.formatoFecha($scope.emp.fchnac);
            }

            if ($scope.emp.fching) {
                $scope.emp.ingreso = $scope.formatoFecha($scope.emp.fching);
            }
             
            if ($scope.emp.fchrei) {
                $scope.emp.reingreso = $scope.formatoFecha($scope.emp.fchrei);
            }

            if ($scope.emp.fchbaj) {
                $scope.emp.baja = $scope.formatoFecha($scope.emp.fchbaj);
            }

			empServicios.guardar(emp).then(function(data){
				alert(data.mensaje);
                $scope.hay = true;
                $scope.emp = {};

                if (data.up == 0) {
                    $scope.empleados.push(data.emp);
                }
			});
        };

        $scope.buscar = function(datos) {
            $scope.formulario = false;

        	if (datos) {
        		$scope.datosbuscar = {'inicio':0, 'termino': datos.termino};
        	} else {
        		$scope.datosbuscar = {'inicio':0};
        	}
        	
        	empServicios.buscar($scope.datosbuscar).then(function(data){
				$scope.datosbuscar.inicio = data.cantidad;
				$scope.empleados  = data.resultados;
				$scope.resultados = true;

                $scope.ocultarbtn(data.cantidad, data.maximo);
        	});
        };

        $scope.mas = function() {
        	empServicios.buscar($scope.datosbuscar).then(function(data){
        		$scope.datosbuscar.inicio += parseInt(data.cantidad);

	        	$scope.empleados = $scope.empleados.concat(data.resultados);

	    		$scope.ocultarbtn(data.cantidad, data.maximo);
        	});
        }

        $scope.ocultarbtn = function(cantidad, maximo) {
        	if ( parseInt(cantidad) < parseInt(maximo) ) {
    			$scope.buscarmas = false;
    		} else {
    			$scope.buscarmas = true;
    		}
        }

        $scope.getEmpleado = function(index){
             $scope.emp = $scope.empleados[index];
             $scope.emp.descuentoisr = parseFloat($scope.emp.descuentoisr);
             $scope.emp.bonificacionley = parseFloat($scope.emp.bonificacionley);
             $scope.emp.sueldo = parseFloat($scope.emp.sueldo);
             $scope.emp.porcentajeigss = parseFloat($scope.emp.porcentajeigss); 
             $scope.emp.activo = parseInt($scope.emp.activo);

             if ($scope.emp.fechanacimiento) {
                $scope.emp.fchnac = $scope.formatoFechajs($scope.emp.fechanacimiento);
             }

             if ($scope.emp.ingreso) {
                $scope.emp.fching = $scope.formatoFechajs($scope.emp.ingreso);
             }
             
             if ($scope.emp.reingreso) {
                $scope.emp.fchrei = $scope.formatoFechajs($scope.emp.reingreso);
             }

             if ($scope.emp.baja) {
                $scope.emp.fchbaj = $scope.formatoFechajs($scope.emp.baja);
             }

             console.log($scope.emp);

             $scope.formulario = true;
             $scope.hay = true;
             $scope.getArchivos();

             goTop();
        };

        $scope.agregarArchivo = function(arc) {
            if ($scope.emp.id) {
                var $btn = $("#btnAgregarArchivo").button('loading');

                arc.vence = $scope.formatoFecha(arc.fchvence);

                empServicios.agregarArchivo($scope.emp.id, arc).then(function(data){
                    $scope.getArchivos();
                    alert(data.mensaje);
                    $btn.button('reset');
                    
                });
            }
        }

        $scope.getArchivos = function(){
            if ($scope.emp.id) {
                empServicios.getArchivos($scope.emp.id).then(function(data){
                    $scope.archivos = data.archivos;
                });
            }
        }

        empresaSrvc.lstEmpresas().then(function(d){
            $scope.empresas = d;
        });

        proyectoSrvc.lstProyecto().then(function(d){
            $scope.proyectos = d;
        });

        pstServicios.lista().then(function(d){
            $scope.puestos = d;
        });

        empServicios.getArchivoTipo().then(function(d) {
            $scope.archivotipo = d;
        });

        $scope.formatoFecha = function(fecha) {
            return fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate();
        };

        $scope.formatoFechajs = function(fecha) {
            var partes = fecha.split('-');
            return new Date(partes[0], partes[1] - 1, partes[2]); 
        };

        /*cuentacSrvc.lstCuentasC().then(function(d){
            $scope.cuentas = d;
        });*/

        $scope.buscar({});
    }]
)
.controller('MntProsueldoController', ['$scope', '$http', 'empServicios', 'empresaSrvc', 
    function($scope, $http, empServicios, empresaSrvc){
        $scope.resultados = false;
        $scope.proyecciones = [];

        $scope.buscar = function(datos) {
        	empServicios.buscarProsueldo(datos).then(function(data){
                $scope.proyecciones = data;
                $scope.resultados = true;
        	});
        };

        $scope.actProsueldo = function(pro) {
            empServicios.guardarProsueldo(pro).then(function(data){
				console.log(data.mensaje);
			});
        };
    }
])
.controller('MntPuestoController', ['$scope', '$http', 'pstServicios',  
    function($scope, $http, pstServicios){
        $scope.formulario  = false;
		$scope.resultados  = false;
		$scope.puestos     = [];
		$scope.inicio      = 0;
		$scope.datosbuscar = [];
		$scope.buscarmas   = true;
        $scope.hay         = false;
        

		$scope.mostrarForm = function() {
			$scope.emp = {};
			$scope.formulario = true;
            $scope.hay = false;
		};

		$scope.guardar = function(emp){
			pstServicios.guardar(emp).then(function(data){
				alert(data.mensaje);
                $scope.hay = true;
                $scope.pst = {};
                
                if (data.up == 0) {
                    $scope.puestos.push(data.puesto);
                }
			});
        };

        $scope.buscar = function(datos) {
            $scope.formulario = false;

        	if (datos) {
        		$scope.datosbuscar = {'inicio':0, 'termino': datos.termino};
        	} else {
        		$scope.datosbuscar = {'inicio':0};
        	}
        	
        	pstServicios.buscar($scope.datosbuscar).then(function(data){
				$scope.datosbuscar.inicio = data.cantidad;
				$scope.puestos  = data.resultados;
                $scope.resultados = true;

				$scope.ocultarbtn(data.cantidad, data.maximo);
        	});
        };

        $scope.mas = function() {
        	pstServicios.buscar($scope.datosbuscar).then(function(data){
        		$scope.datosbuscar.inicio += parseInt(data.cantidad);

	        	$scope.puestos = $scope.puestos.concat(data.resultados);

	    		$scope.ocultarbtn(data.cantidad, data.maximo);
	    		$scope.$digest();
        	});
        }

        $scope.ocultarbtn = function(cantidad, maximo) {
        	if ( parseInt(cantidad) < parseInt(maximo) ) {
    			$scope.buscarmas = false;
    		} else {
    			$scope.buscarmas = true;
    		}
        }

        $scope.getPuesto = function(index){
             $scope.pst = $scope.puestos[index];
             $scope.formulario = true;
             $scope.hay = true;
             goTop();
        };

        $scope.buscar({});
    }
]);
