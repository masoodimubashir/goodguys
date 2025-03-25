<?php

use App\Http\Controllers\Admin\AdminClientsController;
use App\Http\Controllers\Admin\AdminFieldController;
use App\Http\Controllers\Admin\AdminFieldUnitController;
use App\Http\Controllers\Admin\AdminInventoryController;
use App\Http\Controllers\Admin\AdminModuleController;
use App\Http\Controllers\Admin\AdminSaleController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});




Route::middleware(['auth', 'verified', 'role:admin'])->group(function(){


    // Route For Viewing Dashbaord
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');


    // Route For Updating User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    // Route For Inventory Model
    Route::resource('inventory', AdminInventoryController::class);

    
    // Route For Users
    Route::resource('users', AdminUsersController::class);

    
    // Route For Clients
    Route::resource('clients', AdminClientsController::class);

    
    // Route For Field
    Route::resource('field', AdminFieldController::class);


    // Routes For Field Units
    Route::resource('fieldunit', AdminFieldUnitController::class);


    // Route For Sales
    Route::resource('sale', AdminSaleController::class);


    // Route For Module
    Route::resource('module', AdminModuleController::class);



});





require __DIR__.'/auth.php';
