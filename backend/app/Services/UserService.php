<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAllUsers(): Collection
    {
        return Cache::remember('users.all', 60, function () {
            return User::orderBy('created_at', 'desc')->get();
        });
    }

    public function getUserById(int $id): User
    {
        return Cache::remember("users.{$id}", 300, function () use ($id) {
            return User::findOrFail($id);
        });
    }

    public function createUser(array $data): User
    {
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        }

        $user = User::create($data);
        Cache::forget('users.all');
        return $user;
    }

    public function updateUser(int $id, array $data): User
    {
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user = User::findOrFail($id);
        $user->update($data);
        Cache::forget('users.all');
        Cache::forget("users.{$id}");
        return $user->fresh();
    }

    public function deleteUser(int $id): bool
    {
        $user = User::findOrFail($id);
        $result = $user->delete();
        Cache::forget('users.all');
        Cache::forget("users.{$id}");
        return $result;
    }
}

