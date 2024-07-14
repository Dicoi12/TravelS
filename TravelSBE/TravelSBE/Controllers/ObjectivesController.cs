using Microsoft.AspNetCore.Mvc;
using TravelSBE.Data;
using TravelSBE.Models;
using TravelSBE.Entity;

namespace TravelSBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjectivesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ObjectivesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ObjectiveModel>>> GetObjectives()
        {
            return await _context.Objectives.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ObjectiveModel>> GetObjective(int id)
        {
            var objective = await _context.Objectives.FindAsync(id);

            if (objective == null)
            {
                return NotFound();
            }

            return objective;
        }

        // PUT: api/Objectives/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjective(int id, ObjectiveModel objective)
        {
            if (id != objective.Id)
            {
                return BadRequest();
            }

            objective.UpdatedAt = DateTime.UtcNow;
            _context.Entry(objective).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectiveExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Objectives
        [HttpPost]
        public async Task<ActionResult<ObjectiveModel>> PostObjective(Objective objective)
        {
            objective.CreatedAt = DateTime.UtcNow;
            objective.UpdatedAt = DateTime.UtcNow;
            _context.Objectives.Add(objective);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetObjective), new { id = objective.Id }, objective);
        }

        // DELETE: api/Objectives/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjective(int id)
        {
            var objective = await _context.Objectives.FindAsync(id);
            if (objective == null)
            {
                return NotFound();
            }

            _context.Objectives.Remove(objective);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ObjectiveExists(int id)
        {
            return _context.Objectives.Any(e => e.Id == id);
        }
    }
}
