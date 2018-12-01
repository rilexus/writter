import {Get, Controller, Res, Param, Post, Body, UseGuards, Headers} from '@nestjs/common';
import {TextsService} from "./texts.service";
import {Text} from "../../writer/src/app/components/editor/components/text-area/interfaces/Text";
import {AuthGuard} from "@nestjs/passport";

@Controller('texts')
export class TextsController {
	constructor(private textsService: TextsService) {}
	
	// serve angular at root url
	@Get('all')
	async getTexts(@Res() resp) {
		let _texts: Text[] = [];
		await this.textsService.getTexts().then(texts => {
			_texts = texts;
		}); // await till _texts is set then return
		resp.send(_texts);
	}
	
	@Get('delete/:id')
	async deleteText(@Res() resp, @Param('id') id: number) {
		let _succes = false;
		await this.textsService.deleteText(id)
		.then(succes => {
			_succes = succes;
		})
		.catch( succes => {
			_succes = succes;
		});
		resp.send(_succes);
	}
	
	@Post('save')
	@UseGuards(AuthGuard('jwt'))
	async save(@Body() text, @Res() resp, @Headers('authorization') token) {
		console.log('token', token);
		this.textsService.save(text)
			.then(status => {
				resp.send(status);
			})
			.catch(error => {
				console.error(error);
			});
	}
}
