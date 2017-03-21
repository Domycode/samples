Renovate.controller('ContactsController', function($scope,$http){
	console.log('ContactsController loaded!');
	
	$scope.urlsContactUsNg = URLS.contactUsNg;
	$scope.alerts =[];
	$scope.message = {topic: "Подяка"};
	
	$scope.sendButtonDisabled = false;
	
	function showAlert() {
		$scope.alerts.push({msg: 'Ваш лист успішно надіслано!', type: 'success'});
	}
	
	$scope.contactUs = function() {
		$scope.sendButtonDisabled = true;
		$http({
			method: "POST",
			url: $scope.urlsContactUsNg,
			data: $scope.message
		})
		.success(function(response) {			
			if (response.result) {
				showAlert();
			}
		})
	}
	
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
		$scope.sendButtonDisabled = false;
	};          	
});
