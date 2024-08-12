import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(200)
  comment: string
}
