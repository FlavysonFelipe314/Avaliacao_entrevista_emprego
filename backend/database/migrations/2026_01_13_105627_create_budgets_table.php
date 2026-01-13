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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome do orçamento (ex: "Orçamento 2024")
            $table->decimal('total_budget', 15, 2); // Orçamento total
            $table->decimal('fuel_budget', 15, 2)->default(0);
            $table->decimal('maintenance_budget', 15, 2)->default(0);
            $table->decimal('salaries_budget', 15, 2)->default(0);
            $table->decimal('others_budget', 15, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
