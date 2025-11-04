import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para crear un nuevo Workspace.
 */
export class CreateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}
