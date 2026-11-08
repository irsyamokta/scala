<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\User\Requests\UserRequest;
use App\Modules\User\Services\UserService;
use DomainException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class UserController extends Controller
{
    public function __construct(
        protected UserService $service
    ) {}

    public function index(Request $request)
    {
        $search = $request->search;
        $roles = $request->roles;
        $paginate = true;
        $perPage = $request->integer('per_page', 10);

        $users = $this->service->getUsers(
            $search,
            $roles,
            $paginate,
            $perPage,
        );

        return Inertia::render('Dashboard/Superadmin/User/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'roles' => $roles,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(UserRequest $request)
    {
        try {
            $this->service->createUser($request->validated());

            return back();
        } catch (DomainException $e) {
            return back()->withErrors([
                'name' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {
            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem, silakan coba lagi'
            );
        }
    }

    public function update(UserRequest $request, $id)
    {
        try {
            $this->service->updateUser($id, $request->validated());

            return back();
        } catch (DomainException $e) {
            return back()->withErrors([
                'name' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {
            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem, silakan coba lagi'
            );
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteUser($id);

            return back();
        } catch (Throwable $e) {
            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem, silakan coba lagi'
            );
        }
    }

    public function impersonate(Request $request, $id)
    {
        $currentUser = auth()->user();

        if ($currentUser->id === $id) {
            return back()->with('error', 'Tidak dapat masuk ke akun sendiri.');
        }

        $targetUser = User::findOrFail($id);

        $request->session()->put('impersonator_id', $currentUser->id);

        auth()->login($targetUser);

        return redirect()->route('dashboard')->with(
            'success',
            "Berhasil masuk sebagai {$targetUser->name}."
        );
    }

    public function leaveImpersonate(Request $request)
    {
        $impersonatorId = $request->session()->get('impersonator_id');

        if (! $impersonatorId) {
            return redirect()->route('dashboard');
        }

        $admin = User::find($impersonatorId);

        if (! $admin) {
            $request->session()->forget('impersonator_id');
            return redirect()->route('dashboard');
        }

        $request->session()->forget('impersonator_id');
        auth()->login($admin);

        return redirect()->route('user.index')->with(
            'success',
            'Berhasil kembali ke akun Administrator.'
        );
    }
}
