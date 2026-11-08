<?php

use App\Http\Middleware\EnsureOnboardingCompleted;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            StartSession::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'onboarding.complete' => EnsureOnboardingCompleted::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, $request) {
            if ($e instanceof ValidationException) {
                return back()->withErrors($e->errors())->withInput();
            }

            if ($e instanceof AuthenticationException) {
                return redirect()->guest(route('login'));
            }

            if ($e instanceof UnauthorizedException) {
                return redirect()->guest(route('login'));
            }

            $status = $e instanceof HttpExceptionInterface
                ? $e->getStatusCode()
                : 500;

            if (in_array($status, [403, 404, 419, 500])) {
                return Inertia::render("Errors/$status", [
                    'status' => $status,
                    'message' => config('app.debug')
                        ? $e->getMessage()
                        : match ($status) {
                            403 => 'Forbidden',
                            404 => 'Not Found',
                            419 => 'Page Expired',
                            500 => 'Internal Server Error',
                            default => 'Something went wrong',
                        },
                ])->toResponse($request)->setStatusCode($status);
            }

            return Inertia::render("Errors/500", [
                'status' => 500,
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'Something went wrong',
            ])->toResponse($request)->setStatusCode(500);
        });
    })->create();
