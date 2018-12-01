import {Controller, Get} from "@nestjs/common";

@Controller('cats')
export class CatsController {
	
	constructor(){}
	
	@Get('all')
	get() {
	
	}
	
}