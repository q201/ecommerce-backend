import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchLog } from './entities/search-log.entity';
import { SearchSuggestion } from './entities/search-suggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchLog, SearchSuggestion])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {} 