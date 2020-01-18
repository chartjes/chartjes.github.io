---
layout: post
title: "OpenCFP Engineering Diary -- Adding Doctrine"
author: Chris Hartjes
date: 2019-12-02
---

## TL;DR - Adding support to an existing Symfony 3.4 application for Doctrine

(If you like the work I do on OpenCFP, please consider sponsoring me at
[https://github.com/sponsors/chartjes/](https://github.com/sponsors/chartjes/))

Part of the medium-term planning for [OpenCFP](https://github.com/opencfp/opencfp) is
to refactor the application to stop using [Sentinel](https://cartalyst.com/manual/sentinel/)
as the authentication and ACL choice and start using the [Symfony Scurity](https://symfony.com/doc/current/security.html)
component.

When OpenCFP was first built it was a more standalone solution and I picked Sentinel's
predecessor, Sentry. As it got deprecated, we moved to Sentinel and along the way we
added in some code to make [Eloquent](https://laravel.com/docs/5.8/eloquent) easier to
use within the app. When switching to be more Symfony-based, Doctrine is the ORM that
needs to be used. So I have a refactoring process that looks like this:

* Get Doctrine and it's dependencies into the project
* Refactor everything *except* our auth stuff to use Doctrine
* Refactor our authentication and authorization code to use Symfony Security
* Remove Sentinel and all it's dependencies

I had not used Doctrine in many many years so a lot of things have changed. Given
all the trouble I had, I figured I was not alone so it makes sense to document
the changes and additions I made.

As with most work I do on OpenCFP, this was a journey of discovering things I needed to
know that I did not know.

## Packages

Following the directions for [Symfony 3.4](https://symfony.com/doc/3.4/doctrine.html) I
installed my dependencies:

```bash
composer require doctrine/orm
composer require doctrine/doctrine-bundle
composer require doctrine/doctrine-cache-bundle
```

Right now, `composer show` says I have the following Doctrine-related packages installed now

```bash
doctrine/annotations                v1.8.0  
doctrine/cache                      1.9.1   
doctrine/collections                1.6.4   
doctrine/common                     v2.11.0 
doctrine/data-fixtures              1.4.0   
doctrine/dbal                       v2.10.0 
doctrine/doctrine-bundle            1.12.2  
doctrine/doctrine-cache-bundle      1.4.0   
doctrine/doctrine-fixtures-bundle   3.3.0   
doctrine/event-manager              1.1.0   
doctrine/inflector                  1.3.1   
doctrine/instantiator               1.3.0   
doctrine/lexer                      1.2.0   
doctrine/orm                        v2.7.0  
doctrine/persistence                1.2.0   
doctrine/reflection                 v1.0.0  
symfony/doctrine-bridge             v3.4.35 
```

I may have installed some of these packages manually, but who knows.

## Enable Doctrine in the application

The first sign I had no idea what I was doing was when I could not see
any of the Doctrine-related commands when I used `bin/console`. After
moaning on Twitter and asking some questions on Stack Overflow, I realized
it would not automatically find it. so I added a line to my `Kernel.php`
file so that the bundle would be available.

```php
    public function registerBundles()
    {
        $bundles = [
            new FrameworkBundle(),
            new SensioFrameworkExtraBundle(),
            new MonologBundle(),
            new TwigBundle(),
            new SwiftmailerBundle(),
            new WouterJEloquentBundle(),
            new OneupFlysystemBundle(),
            new DoctrineBundle(),
        ];

        if ($this->getEnvironment() !== Environment::TYPE_PRODUCTION) {
            $bundles[] = new DebugBundle();
        }

        if ($this->getEnvironment() === Environment::TYPE_DEVELOPMENT) {
            $bundles[] = new WebServerBundle();
            $bundles[] = new WebProfilerBundle();
        }

        return $bundles;
    }
```

## Making repositories available as a service

I had to update my `resources/config/services/services.yml' file with the following
new section to allow the app to find and inject all the repository files I was going
to create:

```yaml
 OpenCFP\Domain\Repository\:
    public: true
    resource: '%kernel.project_dir%/src/Domain/Repository/*'
```

## Configuration Files 

To make Doctrine see the database connections, I had to modify the
following files:

```bash
resources/config/config_development.yml
resources/config/config_testing.yml
resources/config/config_production.yml
```

adding in the following details (determined through trial-and-error and online searches for help)

```yaml
doctrine:
  dbal:
    url: mysql://root:@127.0.0.1:3306/cfp
    default_table_options:
      charset: utm8mb4
      collate: utg8mb4_unicode_ci
  orm:
    auto_mapping: true
    auto_generate_proxy_classes: true
    mappings:
      OpenCFP\Domain\Entity:
        type: annotation
        dir: "%kernel.root_dir%/../src/Domain/Entity"
        prefix: OpenCFP\Domain\Entity
```

Early on I had my integration test suite failing to even run because it was complaining it
could not find the new repository I had created:

```php
<?php

declare(strict_types=1);

/**
 * Copyright (c) 2013-2019 OpenCFP
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 *
 * @see https://github.com/opencfp/opencfp
 */

namespace OpenCFP\Domain\Repository;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use OpenCFP\Domain\Entity\Airport;

final class AirportRepository
{
    /**
     * @var EntityRepository
     */
    private $repository;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(Airport::class);
    }

    public function withCode(string $code): ?Airport
    {
        $airport = $this->repository->findOneByCode($code);

        if ($airport !== null) {
            return $airport;
        }

        return null;
    }
}

```

Here's the entity I created to go with it

```php
<?php

declare(strict_types=1);

/**
 * Copyright (c) 2013-2019 OpenCFP
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 *
 * @see https://github.com/opencfp/opencfp
 */

namespace OpenCFP\Domain\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="airports")
 */
final class Airport
{
    /**
     * @ORM\Column(type="string", length=3)
     * @ORM\Id
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $country;

    /**
     * @return mixed
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getCountry()
    {
        return $this->country;
    }
}
```

The issue turned out to be I needed to set `auto_generate_proxy_classes` to be `true`. The
error messages from the application itself were not helpful (complaining it could not inject
the `EntityManagerInterface` my code was using). Anyway, once I figured that out my integration
test suite passed. Now I could go and modify my code to use the new repository instead of the
Eloquent model.

Here's a summary of the steps I took to update the action that uses airport details

* removed references to the `AirportInformationDatabase` object that was used to access the list of airports and codes
* added in the use of the new `AirportRepository` object
* updated the constructor for the action to accept `AirportRepository` as a parameter via the magic of autowiring dependencies
* updated the code to use the new repository (and fix a code smell involving an exception being caught but never reacted to)

So now my tests pass and I have a way to add more Doctrine entities and repositories going forward.

