using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelSBE.Data;
using TravelSBE.Entity;
using TravelSBE.Models;

namespace TravelSBE.Services
{
    public class ObjectiveService : IObjectiveService
    {
        private readonly ApplicationDbContext _context;

        public ObjectiveService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ObjectiveModel>> GetObjectivesAsync()
        {
            return await _context.Objectives.ToListAsync();
        }

        public async Task<Objective> GetObjectiveByIdAsync(int id)
        {
            return await _context.Objectives.FindAsync(id);
        }

        public async Task<ObjectiveModel> CreateObjectiveAsync(ObjectiveModel objective)
        {
            objective.CreatedAt = DateTime.UtcNow;
            objective.UpdatedAt = DateTime.UtcNow;
            _context.Objectives.Add(objective);
            await _context.SaveChangesAsync();
            return objective;
        }

        public async Task<bool> UpdateObjectiveAsync(ObjectiveModel objective)
        {
            if (!_context.Objectives.Any(e => e.Id == objective.Id))
            {
                return false;
            }

            objective.UpdatedAt = DateTime.UtcNow;
            _context.Entry(objective).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteObjectiveAsync(int id)
        {
            var objective = await _context.Objectives.FindAsync(id);
            if (objective == null)
            {
                return false;
            }

            _context.Objectives.Remove(objective);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
