using System.Collections.Generic;
using System.Threading.Tasks;
using TravelSBE.Entity;
using TravelSBE.Models;

namespace TravelSBE.Services
{
    public interface IObjectiveService
    {
        Task<IEnumerable<ObjectiveModel>> GetObjectivesAsync();
        Task<ObjectiveModel> GetObjectiveByIdAsync(int id);
        Task<ObjectiveModel> CreateObjectiveAsync(ObjectiveModel objective);
        Task<bool> UpdateObjectiveAsync(ObjectiveModel objective);
        Task<bool> DeleteObjectiveAsync(int id);
    }
}
