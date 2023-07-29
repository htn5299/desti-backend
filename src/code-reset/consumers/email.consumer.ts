import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { MailerService } from '@nest-modules/mailer'

@Processor('send-mail')
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process('forget')
  async forgetPassword(job: Job<unknown>) {
    console.log('start send mail reset')
    const time1 = new Date()
    await this.mailerService.sendMail({
      to: job.data['email'],
      subject: 'Forget Password',
      template: './resetpassword',
      context: { email: job.data['email'], name: job.data['name'], code: job.data['code'] }
    })
    const time2 = new Date()
    console.log(`success in ${time2.getTime() - time1.getTime()} ms`)
  }
}
