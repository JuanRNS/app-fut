-- DropForeignKey
ALTER TABLE "MatchStatistics" DROP CONSTRAINT "MatchStatistics_playerId_fkey";

-- AddForeignKey
ALTER TABLE "MatchStatistics" ADD CONSTRAINT "MatchStatistics_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
