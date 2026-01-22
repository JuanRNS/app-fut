-- DropForeignKey
ALTER TABLE "MatchStatistics" DROP CONSTRAINT "MatchStatistics_matchId_fkey";

-- AddForeignKey
ALTER TABLE "MatchStatistics" ADD CONSTRAINT "MatchStatistics_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
