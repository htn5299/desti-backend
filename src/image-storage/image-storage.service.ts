import { HttpStatus, Injectable } from '@nestjs/common'
import { IImageStorageService } from './image.storage'
import { ConfigService } from '@nestjs/config'
import { S3 } from '@aws-sdk/client-s3'
import { generateUUIDV4, slugString } from '../utils/helpers'
import { MyHttpException } from '../utils/myHttpException'

@Injectable()
export class ImageStorageService implements IImageStorageService {
  private readonly s3 = new S3({
    region: this.configService.getOrThrow('AWS_BUCKET_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
    }
  })
  constructor(private configService: ConfigService) {}
  async upload(file: Express.MulterS3.File) {
    try {
      const objectId = generateUUIDV4()
      const arr_name = file.originalname.split('.')
      const extension = arr_name.pop()
      const name = arr_name.join('.')
      const key = objectId + '_' + slugString(name) + '.' + extension
      await this.s3.putObject({
        Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
        ACL: 'public-read',
        Key: key,
        ContentType: file.mimetype,
        Body: file.buffer
      })
      const url = `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.${this.configService.getOrThrow(
        'AWS_BUCKET_REGION'
      )}.amazonaws.com/${key}`
      return { url }
    } catch (error) {
      throw new MyHttpException('Unable to upload file to S3', HttpStatus.BAD_REQUEST)
    }
  }
  async delete(key: string) {
    try {
      await this.s3.deleteObject({
        Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
        Key: key
      })
      return { message: 'File deleted successfully' }
    } catch (error) {
      throw new MyHttpException('Unable to delete file from S3', HttpStatus.BAD_REQUEST)
    }
  }
}
