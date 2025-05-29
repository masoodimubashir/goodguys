<?php

use App\Http\Controllers\Admin\AdminAccountsController;
use App\Http\Controllers\Admin\AdminBankAccountController;
use App\Http\Controllers\Admin\AdminChallanController;
use App\Http\Controllers\Admin\AdminClientProductController;
use App\Http\Controllers\Admin\AdminClientsController;
use App\Http\Controllers\Admin\AdminCostIncurredController;
use App\Http\Controllers\Admin\AdminFieldController;
use App\Http\Controllers\Admin\AdminInventoryController;
use App\Http\Controllers\Admin\AdminModuleController;
use App\Http\Controllers\Admin\AdminProformaController;
use App\Http\Controllers\Admin\AdminPurchasedProductController;
use App\Http\Controllers\Admin\AdminPurchaseListController;
use App\Http\Controllers\Admin\AdminPurchaseManagmentController;
use App\Http\Controllers\Admin\AdminReturnListController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\Admin\AdminVendorController;
use App\Http\Controllers\Admin\PurchasesItemController;
use App\Http\Controllers\AdminAdminCompanyProfile;
use App\Http\Controllers\AdminInvoiceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});


Route::middleware(['auth', 'verified'])->group(function () {


    // Route For Viewing Dashbaord
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');



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

    // Route For Sales
    Route::resource('accounts', AdminAccountsController::class);

    // Route For Module
    Route::resource('module', AdminModuleController::class);

    // Route For Proforma
    Route::resource('proforma', AdminProformaController::class);

    // Route For Invoice
    Route::resource('invoice', AdminInvoiceController::class);
    Route::post('create-invoive-from-pdf/{id}', [AdminInvoiceController::class, 'createInvoiceFromPdf'])->name('create-invoice-from-pdf');

    // Route For Purchase List
    Route::resource('purchase-list', AdminPurchaseListController::class);

    // Route For Cost Incurred
    Route::resource('cost-incurred', AdminCostIncurredController::class);

    // Route For Compnay Profile
    Route::resource('company-profile', AdminAdminCompanyProfile::class);

    // Route For Bank Account 
    Route::resource('bank-account', AdminBankAccountController::class);

    // Route For return List
    Route::resource('return-list', AdminReturnListController::class);

    // Route For Purchased Product
    Route::resource('purchased-product', AdminPurchasedProductController::class);

    // Route For Challan
    Route::resource('/challan', AdminChallanController::class);
    Route::get('create/challanpdf/{id}', [AdminChallanController::class, 'createChallanPdf'])->name('create.challanpdf');


    // Route For Vendor Model
    Route::resource('/vendor', AdminVendorController::class);

    // Route For Purchase Managment
    Route::resource('/purchase-managment', AdminPurchaseManagmentController::class);

    // Route For Purchased Item
    Route::resource('/purchased-item', PurchasesItemController::class);



    
});





require __DIR__ . '/auth.php';
