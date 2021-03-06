//var app = angular.module("CustomerApp", []);

CustomerApp.controller("profileController", function($scope, $http, $location, $window, $timeout, CustomerService) {

    console.log("Profile controller loaded.")

    var s3 = jQuery.LiveAddress({
        // key: "18981749384552786",
        key: "30557965407706460",
        waitForStreet: true,
        debug: true,
        target: "US",
        placeholder: "Enter address",
        addresses: [{
            freeform: '#homeAddress'
        }, {
            freeform: '#officeAddress'
        },
        {
            freeform: '#otherAddress'
        }]
    });

    s3.on("AddressAccepted", function(event, data, previousHandler)
    {
        console.log("Boo Yah!")
        console.log(JSON.stringify(data.response, null,3))

    });

    // var s31 = jQuery.LiveAddress({
    //     key: "18981749384552786",
    //     waitForStreet: true,
    //     debug: true,
    //     target: "US",
    //     placeholder: "Enter address",
    //     addresses: [{
    //         freeform: '#officeAddress'
    //     }]
    // });

    // s31.on("AddressAccepted", function(event, data, previousHandler)
    // {
    //     console.log("Boo Yah!")
    //     console.log(JSON.stringify(data.response, null,3))

    // });

    sStorage = $window.sessionStorage;

    $scope.placeholder = "enter an address and select a choice."

    $scope.addressKinds = ['Home', 'Work', 'Other']

    $scope.addressKind = function(idx) {
        console.log("Address kknk = " + $scope.addressKinds[idx]);
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $scope.getProfileData = function() {
        console.log('getting profile data');
        // setTimeout(() => {  console.log("World!"); }, 5000);

        

        CustomerService.checkLogin($scope).then(function() {
            CustomerService.getCustomer($scope.lemail).then(function() {
                let cId = sStorage.getItem("cust_id");

                //get customerdetials/data
                CustomerService.getPersonalData($scope, cId).then(function (result) {
                    console.log(result);
                    console.log("updated the personal data");
                }).
                catch(function(error) {
                    console.log("Error in getting personal data");
                    console.log(error);
                });
                //get profiledata
                CustomerService.getProfileData($scope, cId).then(function (result) {
                    console.log(result);
                }).
                catch(function(error) {
                    console.log("Error in getting profile data");
                    console.log(error);
                });
                //Done updating both personal and profile data

            }).        
            catch(function(error) {
                console.log("Error in getting customer data");
                console.log(error);
            });         
        }).
        catch(function(error) {
            console.log("Error in checking login");
            console.log(error);
        });
    };

    $scope.doUpdatePersonal = function() {
        data = {};
        data["first_name"] = $scope.firstNameUpdate;
        data["last_name"] = $scope.lastNameUpdate;

        CustomerService.doUpdatePersonal($scope, data).then(function (result) {
            console.log("profileController.js doUpdatePersonal");
        }).
            catch(function(error) {
            console.log("Error");
            console.log(error);
        })
    };

    $scope.doUpdateProfile = function() {
        data = {};

        if(!$scope.homeAddressUpdate &&
            !$scope.homeEmailUpdate && 
            !$scope.homePhoneUpdate &&
            !$scope.officeAddressUpdate &&
            !$scope.officeEmailUpdate && 
            !$scope.officePhoneUpdate &&
            !$scope.otherAddressUpdate &&
            !$scope.otherEmailUpdate &&
            !$scope.otherPhoneUpdate) {
            alert("Please provide some details to edit!");
            return;
        }

        if($scope.homeAddressUpdate || $scope.homeEmailUpdate || $scope.homePhoneUpdate) data['Home'] = {};
        if($scope.officeAddressUpdate || $scope.officeEmailUpdate || $scope.officePhoneUpdate) data['Office'] = {};
        if($scope.otherAddressUpdate || $scope.otherEmailUpdate || $scope.otherPhoneUpdate) data['Other'] = {};

        if($scope.homeAddressUpdate) data['Home']['Address'] = $scope.homeAddressUpdate;
        if($scope.homeEmailUpdate) data['Home']['Email'] = $scope.homeEmailUpdate;
        if($scope.homePhoneUpdate) data['Home']['Phone'] = $scope.homePhoneUpdate;

        if($scope.officeAddressUpdate) data['Office']['Address'] = $scope.officeAddressUpdate;
        if($scope.officeEmailUpdate) data['Office']['Email'] = $scope.officeEmailUpdate;
        if($scope.officePhoneUpdate) data['Office']['Phone'] = $scope.officePhoneUpdate;

        if($scope.otherAddressUpdate) data['Other']['Address'] = $scope.otherAddressUpdate;
        if($scope.otherEmailUpdate) data['Other']['Email'] = $scope.otherEmailUpdate;
        if($scope.otherPhoneUpdate) data['Other']['Phone'] = $scope.otherPhoneUpdate;

        data['user_id'] = sStorage.getItem("cust_id");
        // make a get call with cust it to see if user exists
        CustomerService.checkProfileData($scope, data['user_id']).then(function (result) {
            console.log(result);
            // sStorage.setItem("profile_etag", result['headers']['Etag']);
            CustomerService.doUpdateProfile($scope, data, data['user_id']).then(function (result) {
                console.log("profileController.js - preform doUpdateProfile");
                console.log("updating the new detials....updated");
            }).
            catch(function(error) {
                console.log("Error");
                console.log(error);
            })   
        }).
        catch(function(error) {
            console.log("error=");
            console.log(error);
            if(error == 404) {
                console.log("creating a new profile for the user!");
                CustomerService.doCreateProfile(data).then(function (result) {
                    console.log("profileController.js - preform doCreateProfile");
                }).
                catch(function(error) {
                    console.log("Error");
                    console.log(error);
                })                
            }
        })
    };

});

