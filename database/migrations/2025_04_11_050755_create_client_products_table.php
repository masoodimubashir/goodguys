<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('client_products', function (Blueprint $table) {
            $table->id();
            $table->string('client_name', 100);
            $table->string('client_email', 150)->unique();
            $table->string('client_phone', 10);
            $table->text('client_address');
            $table->string('site_name');
            $table->integer('tax')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_products');
    }
};
