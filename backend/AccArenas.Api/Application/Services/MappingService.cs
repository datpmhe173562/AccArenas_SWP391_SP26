using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace AccArenas.Api.Application.Services
{
    public interface IMappingService
    {
        // Category mappings
        CategoryDto ToDto(Category category);
        IEnumerable<CategoryDto> ToDto(IEnumerable<Category> categories);
        Category ToEntity(CreateCategoryRequest request);
        void UpdateEntity(Category category, UpdateCategoryRequest request);

        // User mappings
        Task<UserDto> ToDto(ApplicationUser user, UserManager<ApplicationUser> userManager);
        Task<IEnumerable<UserDto>> ToDto(
            IEnumerable<ApplicationUser> users,
            UserManager<ApplicationUser> userManager
        );
        ApplicationUser ToEntity(CreateUserRequest request);
        void UpdateEntity(ApplicationUser user, UpdateUserRequest request);

        // Role mappings
        RoleDto ToDto(ApplicationRole role);
        IEnumerable<RoleDto> ToDto(IEnumerable<ApplicationRole> roles);
        ApplicationRole ToEntity(CreateRoleRequest request);
        void UpdateEntity(ApplicationRole role, UpdateRoleRequest request);

        // Promotion mappings
        PromotionDto ToDto(Promotion promotion);
        IEnumerable<PromotionDto> ToDto(IEnumerable<Promotion> promotions);
        Promotion ToEntity(CreatePromotionRequest request);
        void UpdateEntity(Promotion promotion, UpdatePromotionRequest request);

        // GameAccount mappings
        GameAccountDto ToDto(GameAccount gameAccount);
        IEnumerable<GameAccountDto> ToDto(IEnumerable<GameAccount> gameAccounts);
        GameAccount ToEntity(CreateGameAccountRequest request);
        void UpdateEntity(GameAccount gameAccount, UpdateGameAccountRequest request);
    }

    public class MappingService : IMappingService
    {
        private readonly IMapper _mapper;

        public MappingService(IMapper mapper)
        {
            _mapper = mapper;
        }

        // Category mappings
        public CategoryDto ToDto(Category category) => _mapper.Map<CategoryDto>(category);

        public IEnumerable<CategoryDto> ToDto(IEnumerable<Category> categories) =>
            _mapper.Map<IEnumerable<CategoryDto>>(categories);

        public Category ToEntity(CreateCategoryRequest request) => _mapper.Map<Category>(request);

        public void UpdateEntity(Category category, UpdateCategoryRequest request) =>
            _mapper.Map(request, category);

        // User mappings
        public async Task<UserDto> ToDto(
            ApplicationUser user,
            UserManager<ApplicationUser> userManager
        )
        {
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Roles = await userManager.GetRolesAsync(user);
            return userDto;
        }

        public async Task<IEnumerable<UserDto>> ToDto(
            IEnumerable<ApplicationUser> users,
            UserManager<ApplicationUser> userManager
        )
        {
            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var userDto = await ToDto(user, userManager);
                userDtos.Add(userDto);
            }
            return userDtos;
        }

        public ApplicationUser ToEntity(CreateUserRequest request)
        {
            var user = _mapper.Map<ApplicationUser>(request);
            user.Id = Guid.NewGuid();
            return user;
        }

        public void UpdateEntity(ApplicationUser user, UpdateUserRequest request) =>
            _mapper.Map(request, user);

        // Role mappings
        public RoleDto ToDto(ApplicationRole role) => _mapper.Map<RoleDto>(role);

        public IEnumerable<RoleDto> ToDto(IEnumerable<ApplicationRole> roles) =>
            _mapper.Map<IEnumerable<RoleDto>>(roles);

        public ApplicationRole ToEntity(CreateRoleRequest request)
        {
            var role = _mapper.Map<ApplicationRole>(request);
            role.Id = Guid.NewGuid();
            return role;
        }

        public void UpdateEntity(ApplicationRole role, UpdateRoleRequest request) =>
            _mapper.Map(request, role);

        // Promotion mappings
        public PromotionDto ToDto(Promotion promotion) => _mapper.Map<PromotionDto>(promotion);

        public IEnumerable<PromotionDto> ToDto(IEnumerable<Promotion> promotions) =>
            _mapper.Map<IEnumerable<PromotionDto>>(promotions);

        public Promotion ToEntity(CreatePromotionRequest request)
        {
            var promotion = _mapper.Map<Promotion>(request);
            promotion.Id = Guid.NewGuid();
            return promotion;
        }

        public void UpdateEntity(Promotion promotion, UpdatePromotionRequest request) =>
            _mapper.Map(request, promotion);

        // GameAccount mappings
        public GameAccountDto ToDto(GameAccount gameAccount) =>
            _mapper.Map<GameAccountDto>(gameAccount);

        public IEnumerable<GameAccountDto> ToDto(IEnumerable<GameAccount> gameAccounts) =>
            _mapper.Map<IEnumerable<GameAccountDto>>(gameAccounts);

        public GameAccount ToEntity(CreateGameAccountRequest request)
        {
            var gameAccount = _mapper.Map<GameAccount>(request);
            gameAccount.Id = Guid.NewGuid();
            return gameAccount;
        }

        public void UpdateEntity(GameAccount gameAccount, UpdateGameAccountRequest request) =>
            _mapper.Map(request, gameAccount);
    }
}
