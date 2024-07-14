using AutoMapper;
using TravelSBE.Models;
using TravelSBE.Entity;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Objective, ObjectiveModel>();
        CreateMap<ObjectiveModel, Objective>();
    }
}
