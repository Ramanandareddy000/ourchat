# How to Get Data from Frontend in NestJS Application

This guide explains how to receive and handle data from frontend clients in your NestJS application. We'll cover various methods of data transmission, validation, and processing.

## Table of Contents

1. [Overview](#overview)
2. [HTTP Methods and Data Reception](#http-methods-and-data-reception)
3. [Receiving Data with DTOs](#receiving-data-with-dtos)
4. [Validation](#validation)
5. [Route Parameters](#route-parameters)
6. [Query Parameters](#query-parameters)
7. [Working with JSON Data](#working-with-json-data)
8. [File Uploads](#file-uploads)
9. [Best Practices](#best-practices)

## Overview

In NestJS, data from the frontend is typically received through HTTP requests using different methods:

- **POST**: For creating new resources
- **PUT/PATCH**: For updating existing resources
- **GET**: For retrieving data (with query parameters)
- **DELETE**: For removing resources

Data can be sent in several ways:
- Request body (JSON)
- Route parameters (in the URL path)
- Query parameters (in the URL query string)
- Headers
- File uploads

## HTTP Methods and Data Reception

### POST Requests (Creating Resources)

POST requests are used to send data to create new resources. The data is typically sent in the request body.

```typescript
@Post()
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  return this.userService.create(createUserDto);
}
```

**Frontend usage example:**
```javascript
// Using fetch API
const userData = {
  username: 'john_doe',
  password: 'securePassword123',
  displayName: 'John Doe'
};

fetch('/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => console.log(data));
```

### PUT Requests (Updating Resources)

PUT requests are used to update existing resources. Data is sent in the request body, and the resource ID is typically included in the URL.

```typescript
@Put(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateUserDto: UpdateUserDto,
): Promise<User | null> {
  return this.userService.update(id, updateUserDto);
}
```

**Frontend usage example:**
```javascript
const updatedUserData = {
  displayName: 'John Smith'
};

fetch('/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updatedUserData)
})
.then(response => response.json())
.then(data => console.log(data));
```

## Receiving Data with DTOs (Data Transfer Objects)

DTOs are objects that define how the data will be sent over the network. They're used to validate incoming data and provide type safety.

### Creating DTOs

Create a DTO for each type of data you want to receive:

```typescript
// src/users/dto/create-user.dto.ts
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
```

### Using DTOs in Controllers

```typescript
@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  return this.userService.create(createUserDto);
}
```

The `@UsePipes(new ValidationPipe({ transform: true }))` decorator enables automatic validation of the DTO based on the decorators you've added.

## Validation

Validation is handled automatically when you use `ValidationPipe`. The class-validator decorators on your DTOs will be checked, and if validation fails, NestJS will automatically return a 400 Bad Request response with details about the validation errors.

### Global Validation

To enable validation for your entire application, add the ValidationPipe in your `main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
```

### Manual Validation

You can also apply validation to specific routes only:

```typescript
@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  return this.userService.create(createUserDto);
}
```

## Route Parameters

Route parameters are dynamic parts of the URL that are used to identify specific resources.

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
  return this.userService.findOneById(id);
}
```

**Frontend usage example:**
```javascript
// This will call the route with id = 1
fetch('/users/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

You can also access all route parameters at once:

```typescript
@Get(':id')
async findOne(@Param() params: any): Promise<User | null> {
  const { id } = params;
  return this.userService.findOneById(id);
}
```

## Query Parameters

Query parameters are key-value pairs that appear after the `?` in a URL.

```typescript
@Get()
async findAll(@Query('limit') limit?: number, @Query('offset') offset?: number): Promise<User[]> {
  return this.userService.findAll(limit, offset);
}
```

**Frontend usage example:**
```javascript
// This will call the route with query parameters
fetch('/users?limit=10&offset=0')
  .then(response => response.json())
  .then(data => console.log(data));
```

You can also access all query parameters at once:

```typescript
@Get()
async findAll(@Query() query: any): Promise<User[]> {
  const { limit, offset } = query;
  return this.userService.findAll(limit, offset);
}
```

## Working with JSON Data

NestJS automatically parses JSON data from the request body when you use the `@Body()` decorator.

### Receiving Complex Objects

```typescript
// DTO for complex nested data
export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => MetaDataDto)
  metadata: MetaDataDto;
}

export class MetaDataDto {
  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
```

**Frontend usage example:**
```javascript
const postData = {
  title: 'My First Post',
  content: 'This is the content of my post',
  metadata: {
    category: 'Technology',
    tags: ['nestjs', 'backend', 'api']
  }
};

fetch('/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(postData)
});
```

## File Uploads

For file uploads, you'll need to use the `@UploadedFile()` or `@UploadedFiles()` decorators along with appropriate middleware.

### Single File Upload

```typescript
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    }
  })
}))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    url: `/uploads/${file.filename}`,
    originalName: file.originalname,
    size: file.size
  };
}
```

**Frontend usage example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/users/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## Best Practices

1. **Always validate incoming data**: Use DTOs with class-validator decorators to ensure data integrity.

2. **Use appropriate HTTP methods**: Follow REST conventions for CRUD operations.

3. **Handle errors gracefully**: Implement proper error handling and return meaningful error messages.

4. **Use pipes for data transformation**: Use built-in pipes like `ParseIntPipe` to convert and validate data types.

5. **Keep DTOs separate from entities**: DTOs should be tailored for the API, while entities represent your database structure.

6. **Use Swagger/OpenAPI documentation**: Document your API endpoints with @Api decorators for better frontend integration.

7. **Implement rate limiting**: Protect your endpoints from abuse by implementing rate limiting.

8. **Use HTTPS in production**: Always use HTTPS in production environments to secure data transmission.

9. **Sanitize user input**: Always sanitize user input to prevent XSS and other injection attacks.

10. **Log important operations**: Log significant data operations for debugging and auditing purposes.

## Example Implementation

Here's a complete example showing how to receive and handle user data:

```typescript
// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '../models';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<User[]> {
    return this.userService.findAll(limit, offset);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.userService.delete(id);
  }
}
```

This implementation provides a complete RESTful API for managing users with proper validation, error handling, and separation of concerns.